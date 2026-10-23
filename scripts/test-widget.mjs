import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import * as fixture from "../tests/widget/fixtures.mjs";
import { checkFieldOrder } from "../tests/widget/field-order.mjs";

const workspace = fileURLToPath(new URL("../", import.meta.url));
const artifacts = process.env.WIDGET_TEST_ARTIFACTS ?? path.join(workspace, "node_modules/.tmp/widget-check");
const baselineDist = process.env.WIDGET_BASELINE_DIST ?? path.join(workspace, "node_modules/.tmp/css-modules-baseline/dist");
const currentDist = path.join(workspace, "dist");
await mkdir(artifacts, { recursive: true });
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".svg": "image/svg+xml" };
const servers = [];
const checks = [];

async function serve(directory) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (url.pathname === "/host.html") {
        const hostile = url.searchParams.get("hostile") === "1";
        const embedSrc = new URL("/embed.js", url.searchParams.get("assets") ?? url.origin).href;
        const language = url.searchParams.get("language") === "ru" ? "ru" : "en";
        res.setHeader("Content-Type", "text/html");
        res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${fixture.hostCss}${hostile ? fixture.hostileCss : ""}</style></head><body><div id="host-shell"><aside id="host-probe" class="main"><button class="button">Host button</button><a href="#host" class="title">Host link</a><table class="table"><tbody><tr><td>Host cell</td></tr></tbody></table></aside><div id="embed-position">${url.searchParams.get("defer") === "1" ? "" : `<script src="${embedSrc}" data-language="${language}" data-link="https://shop.test/search?q=" data-view="${url.searchParams.get("full") === "1" ? "full" : ""}"></script>`}</div></div></body></html>`);
        return;
      }
      const filename = path.resolve(directory, "." + (url.pathname === "/" ? "/index.html" : url.pathname));
      if (!filename.startsWith(directory + path.sep)) throw new Error("Invalid file path");
      let contents = await readFile(filename);
      if (url.pathname === "/embed.js" && !url.searchParams.has("unconfigured")) contents = Buffer.from(contents.toString().replaceAll("$VITE_BASE_URL", url.origin));
      res.setHeader("Content-Type", mime[path.extname(filename)] ?? "application/octet-stream");
      res.end(contents);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}

const browser = await chromium.launch({ channel: process.env.WIDGET_BROWSER ?? "chrome", headless: true });
let current;
let baseline;
const errors = [];
const waitForIdle = async (page) => {
  await page.locator('[class*="widget__title"]').first().waitFor();
  await page.locator('[class*="page-loader"]').waitFor({ state: "hidden" }).catch(() => {});
  await page.evaluate(async () => {
    const roots = [document, ...Array.from(document.querySelectorAll("*")).map((el) => el.shadowRoot).filter(Boolean)];
    const images = roots.flatMap((root) => Array.from(root.querySelectorAll("img")));
    await Promise.all(images.map((image) => image.decode().catch(() => {})));
    await document.fonts.ready;
  });
  await page.waitForTimeout(150);
};

async function newPage(origin, directory, { width = 1440, height = 1000, dark = false } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.addInitScript(({ dark }) => {
    localStorage.setItem("language", "en");
    if (!localStorage.getItem("catalog-theme")) localStorage.setItem("catalog-theme", dark ? "dark" : "light");
    window.__WIDGET_TOKEN__ = "test-token";
  }, { dark });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === "widget-fixture.test") return route.fulfill({ contentType: "image/svg+xml", body: fixture.svg });
    if (url.hostname === "vinside.carcatonline.com") {
      try {
        return route.fulfill({ contentType: mime[path.extname(url.pathname)], body: await readFile(path.join(directory, url.pathname)) });
      } catch { return route.abort(); }
    }
    if (["xhr", "fetch"].includes(request.resourceType()) && !/\.(js|css|ttf|png|svg)$/.test(url.pathname)) {
      const headers = { "access-control-allow-origin": origin, "access-control-allow-credentials": "true", "access-control-allow-headers": "*" };
      if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers });
      try {
        return route.fulfill({ json: fixture.apiResponse(url, request.postData()), headers });
      } catch (error) { errors.push(error.message); return route.abort(); }
    }
    return route.continue();
  });
  return page;
}

async function capture(page, filename, initial = false, preserveHover = false) {
  if (!preserveHover) await page.mouse.move(0, 0);
  await waitForIdle(page);
  const target = initial ? page.locator('[class~="widget"], [class*="Widget-module_widget_"]').first() : page;
  // Keep the external backdrop identical where rounded widget corners reveal
  // it. Host-page colors are intentionally allowed to differ outside the UI.
  if (initial) await target.evaluate((root) => { root.parentElement.style.backgroundColor = "white"; });
  if (initial) {
    const layout = await target.evaluate((root) => [root, ...root.querySelectorAll("*")].map((el) => {
      const style = getComputedStyle(el), rect = el.getBoundingClientRect();
      const properties = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "padding", "margin", "border", "boxSizing", "display", "height", "width", "color", "verticalAlign"];
      return { tag: el.tagName, text: el.children.length ? "" : el.textContent, x: rect.x, y: rect.y, width: rect.width, height: rect.height, ...Object.fromEntries(properties.map((key) => [key, style[key]])) };
    }));
    await writeFile(path.join(artifacts, filename + ".layout.json"), JSON.stringify(layout, null, 2));
  }
  const buffer = await target.screenshot({ animations: "disabled" });
  await writeFile(path.join(artifacts, filename + ".png"), buffer);
  return buffer;
}

function compare(a, b, name, allowedRatio = 0) {
  const first = PNG.sync.read(a), second = PNG.sync.read(b);
  assert.equal(second.width, first.width, `${name}: screenshot width changed`);
  assert.equal(second.height, first.height, `${name}: screenshot height changed`);
  const diff = new PNG({ width: first.width, height: first.height });
  const pixels = pixelmatch(first.data, second.data, diff.data, first.width, first.height, { threshold: 0.1, includeAA: false });
  const ratio = pixels / (first.width * first.height);
  checks.push({ name, pixels, ratio });
  if (pixels) return writeFile(path.join(artifacts, name + "-diff.png"), PNG.sync.write(diff)).then(() => assert.ok(ratio <= allowedRatio, `${name}: ${pixels} changed pixels (${(ratio * 100).toFixed(3)}%)`));
}

const scenarios = [
  ["models", []], ["year", fixture.modelPath], ["engine", fixture.yearPath],
  ["groups", fixture.vehiclePath], ["subgroups", fixture.groupPath], ["parts", fixture.partsPath],
  ["analogs", fixture.analogsPath], ["analog-detail", fixture.detailPath],
  ["vin", fixture.vinPath], ["oe", fixture.oePath],
  ["models-list", [], { list: true }], ["parameters-list", fixture.modelPath, { list: true }],
  ["groups-list", fixture.vehiclePath, { list: true }],
  ["table-preview", [], { list: true, preview: true }],
  ["parts-popup", fixture.partsPath, { popup: true }],
  ["full-widget", null, { full: true }],
  ["standalone-widget", null, { standalone: true }],
  ["standalone-parts", fixture.partsPath, { standalone: true }],
];

async function prepareScenario(page, origin, routePath, options, hostile = false) {
  const href = routePath ? fixture.routeUrl(origin, routePath, !options.standalone) : origin + (options.standalone ? "/" : "/host.html");
  const url = new URL(href);
  if (options.full) url.searchParams.set("full", "1");
  if (hostile) url.searchParams.set("hostile", "1");
  await page.goto(url.href);
  await waitForIdle(page);
  // The old standalone entry did not propagate the saved mode to its inline
  // root. Compare both renderers with the same theme context, including there.
  if (options.standalone) await page.evaluate(() => {
    document.getElementById("root").dataset.carcatTheme = localStorage.getItem("catalog-theme") ?? "light";
  });
  if (page.viewportSize().width < 768 && (options.list || options.popup)) {
    const closeSidebar = page.locator('button[class*="sidebar__toggle"]');
    if (await closeSidebar.isVisible()) { await closeSidebar.click(); await page.waitForTimeout(250); }
  }
  if (options.list) {
    await page.locator('button[class*="cards-section__switch-button"]').nth(1).click();
    await waitForIdle(page);
  }
  if (options.popup) await page.locator('svg[class*="catalog-parts__icon"]').first().click();
  if (options.preview) await page.locator('img[class*="table-image"]').first().hover();
  return url;
}

try {
  current = await serve(currentDist);
  try { await access(baselineDist); baseline = await serve(baselineDist); } catch { console.log("Original build not available; running isolation and functional checks only."); }

  for (const size of process.env.WIDGET_TEST_FOCUS === "functional" ? [] : [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    for (const dark of [false, true]) {
      const key = `${size.width}-${dark ? "dark" : "light"}`;
      const page = await newPage(current, currentDist, { ...size, dark });
      const old = baseline ? await newPage(baseline, baselineDist, { ...size, dark }) : undefined;
      for (const [name, routePath, options = {}] of [["widget", null], ...scenarios]) {
        await prepareScenario(page, current, routePath, options);
        const updated = await capture(page, `${key}-${name}-current`, !routePath, options.preview);
        if (old) {
          await prepareScenario(old, baseline, routePath, options);
          const original = await capture(old, `${key}-${name}-original`, !routePath, options.preview);
          await compare(original, updated, `${key}-${name}`);
        }
        if (!options.standalone) {
          await prepareScenario(page, current, routePath, options, true);
          const hostile = await capture(page, `${key}-${name}-hostile`, !routePath, options.preview);
          await compare(updated, hostile, `${key}-${name}-isolation`);
        }
        assert.equal(await page.locator("[data-carcat-root]").evaluateAll((roots) => roots.some((root) => root.shadowRoot)), false);
      }
      await page.close(); await old?.close();
      console.log(`Visual comparison and host isolation passed: ${key}`);
    }
  }

  // Verify that styles do not escape into the embedding page.
  const page = await newPage(current, currentDist);
  await page.goto(current + "/host.html?defer=1&hostile=1");
  const hostStyles = () => page.locator("#host-probe, #host-probe *").evaluateAll((nodes) => nodes.map((node) => {
    const style = getComputedStyle(node);
    return Object.fromEntries(["display", "color", "fontFamily", "fontSize", "padding", "border", "backgroundColor", "lineHeight", "letterSpacing", "boxSizing", "outline"].map((key) => [key, style[key]]));
  }));
  const before = await hostStyles();
  await page.evaluate(() => {
    const script = document.createElement("script"); script.src = "/embed.js"; script.dataset.language = "en";
    document.querySelector("#embed-position").append(script);
  });
  await waitForIdle(page);
  assert.deepEqual(await hostStyles(), before, "Widget styles changed the host page");
  await page.evaluate(() => {
    const url = new URL(location.href); url.searchParams.delete("defer");
    history.replaceState(history.state, "", url);
    document.body.style.cursor = "crosshair";
    document.body.style.userSelect = "text";
  });

  // Exercise the actual click path, not only URL restoration.
  await page.locator('li[class*="widget__cell"]').filter({ has: page.getByText("Audi", { exact: true }) }).first().click();
  await waitForIdle(page);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden", "Loader cleanup unlocked the host page while the catalog was open");
  await page.locator('[class*="catalog-group-card"]').filter({ hasText: "Audi 100" }).first().click();
  await waitForIdle(page);
  await page.locator('[class*="catalog-group-card"]').filter({ hasText: "1994" }).first().click();
  await waitForIdle(page);
  await page.locator('[class*="catalog-group-card"]').filter({ hasText: "2.0 petrol" }).first().click();
  await waitForIdle(page);
  await page.locator('[class*="catalog-group-card"]').filter({ hasText: "Engine" }).first().click();
  await waitForIdle(page);
  await page.locator('[class*="catalog-group-card"]').filter({ hasText: "Engine assembly" }).first().click();
  await waitForIdle(page);
  assert.ok(await page.locator('[class*="catalog-parts__table"]').count());
  const touch = await page.locator("#catalog-root").evaluate((element) => {
    const inside = new Event("touchmove", { bubbles: true, cancelable: true }); element.dispatchEvent(inside);
    const outside = new Event("touchmove", { bubbles: true, cancelable: true }); document.body.dispatchEvent(outside);
    return { inside: inside.defaultPrevented, outside: outside.defaultPrevented };
  });
  assert.deepEqual(touch, { inside: false, outside: true }, "Catalog touch scrolling was blocked");
  const resize = await page.locator('[class*="catalog-parts__resize-handle"]').boundingBox();
  await page.mouse.move(resize.x + 2, resize.y + 20);
  await page.mouse.down(); await page.mouse.move(resize.x - 30, resize.y + 20); await page.mouse.up();
  assert.deepEqual(await page.evaluate(() => ({ cursor: document.body.style.cursor, userSelect: document.body.style.userSelect })), { cursor: "crosshair", userSelect: "text" });
  const zoomValue = page.locator('[class*="catalog-parts__zoom-value"]').first();
  await page.locator('[class*="catalog-parts__zoom-btn"]').first().click();
  assert.notEqual(await zoomValue.textContent(), "100%");
  await page.locator('[class*="catalog-parts__mini-img"]').last().click();
  await page.locator('button[class*="catalog-parts__tb"]').filter({ hasText: "Analog" }).first().click();
  await waitForIdle(page);
  await page.locator('li[class*="breadcrumbs__el"]').filter({ hasText: "Engine assembly" }).click();
  await waitForIdle(page);
  assert.equal(await page.locator('[class*="catalog-analogs__table"]').count(), 0);
  await page.goBack(); await waitForIdle(page);
  assert.ok(await page.locator('[class*="catalog-analogs__table"]').count());
  await page.goForward(); await waitForIdle(page);
  assert.ok(await page.locator('[class*="catalog-parts__table"]').count());
  console.log("Click navigation, parts controls and browser history passed.");

  // All ten palettes work with both modes and reach both mounting roots.
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  const paletteIds = ["blue", "green", "emerald", "teal", "cyan", "indigo", "violet", "rose", "orange", "graphite"];
  for (const mode of ["light", "dark"]) {
    await page.getByRole("button", { name: mode === "light" ? "Light theme" : "Dark theme" }).click();
    const seen = new Set();
    for (const id of paletteIds) {
      await page.locator(`[data-palette-choice="${id}"]`).click();
      const styles = await page.locator("[data-carcat-root]").evaluateAll((roots) => roots.map((root) => ({
        mode: root.dataset.carcatTheme, palette: root.dataset.carcatPalette,
        accent: getComputedStyle(root).getPropertyValue("--carcat-blue").trim(),
      })));
      assert.ok(styles.length >= 2);
      assert.ok(styles.every((root) => root.mode === mode && root.palette === id && root.accent === styles[0].accent));
      seen.add(styles[0].accent);
      if ((mode === "light" && id === "green") || (mode === "dark" && id === "violet")) {
        await page.screenshot({ path: path.join(artifacts, `palette-${id}-${mode}.png`), animations: "disabled" });
      }
    }
    assert.equal(seen.size, 10);
  }
  await page.reload(); await waitForIdle(page);
  assert.ok((await page.locator("[data-carcat-root]").evaluateAll((roots) => roots.map((root) => root.dataset.carcatPalette))).every((palette) => palette === "graphite"));
  assert.ok((await page.locator("[data-carcat-root]").evaluateAll((roots) => roots.map((root) => root.dataset.carcatTheme))).every((mode) => mode === "dark"));
  await page.locator('button[class*="catalog-header__button"]').first().click();
  await page.locator("#catalog-root").waitFor({ state: "detached" });
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  console.log("Ten palettes, both modes, portal propagation and persistence passed.");
  await page.close();

  await checkFieldOrder({ newPage, origin: current, directory: currentDist, waitForIdle });

  // The loader and CSS/fonts must also work from a different origin.
  const externalHost = await serve(currentDist);
  const remote = await newPage(externalHost, currentDist);
  await remote.goto(`${externalHost}/host.html?hostile=1&assets=${encodeURIComponent(current)}`);
  await waitForIdle(remote);
  assert.equal(await remote.locator('li[class*="widget__cell"]').count(), fixture.catalogs.length);
  assert.equal(await remote.locator('link[data-carcat-styles]').getAttribute("href"), `${current}/widget.css`);
  assert.equal(await remote.evaluate(() => document.fonts.check('16px "CarcatRoboto"')), true);
  await remote.goto(`${externalHost}/host.html?defer=1&hostile=1`);
  await remote.evaluate((assetOrigin) => {
    const script = document.createElement("script"); script.src = `${assetOrigin}/embed.js?unconfigured=1`;
    document.querySelector("#embed-position").append(script);
  }, current);
  await waitForIdle(remote);
  assert.equal(await remote.locator('li[class*="widget__cell"]').count(), fixture.catalogs.length);
  assert.equal(await remote.locator('link[data-carcat-styles]').getAttribute("href"), `${current}/widget.css`);
  await remote.close();

  // Direct mounting into an arbitrary element also loads CSS and cleans up.
  const direct = await newPage(externalHost, currentDist);
  await direct.goto(`${externalHost}/host.html?defer=1&hostile=1`);
  await direct.evaluate(async (assetOrigin) => {
    const container = document.createElement("div"); container.id = "custom-mount"; container.className = "original-host-class";
    document.querySelector("#embed-position").append(container);
    const { mountWidget } = await import(`${assetOrigin}/widget.js`);
    window.unmountTestWidget = await mountWidget(container, { language: "en", view: "full" });
  }, current);
  await waitForIdle(direct);
  assert.equal(await direct.locator("[data-carcat-root]").count(), 2);
  await direct.evaluate(() => window.unmountTestWidget());
  assert.equal(await direct.locator("#widget-catalog-portal").count(), 0);
  assert.equal(await direct.locator("#custom-mount").getAttribute("class"), "original-host-class");
  assert.equal(await direct.locator("[data-carcat-root]").count(), 0);
  await direct.close();
  console.log("Cross-origin embedding, automatic stylesheet loading and unmount cleanup passed.");
  assert.deepEqual(errors, [], "Browser errors occurred");
  await writeFile(path.join(artifacts, "report.json"), JSON.stringify({ checks, errors }, null, 2));
  console.log(`All widget checks passed. Artifacts: ${artifacts}`);
} catch (error) {
  console.error("Browser diagnostics:", errors);
  for (const [index, context] of browser.contexts().entries()) {
    for (const [pageIndex, page] of context.pages().entries()) {
      await page.screenshot({ path: path.join(artifacts, `failure-${index}-${pageIndex}.png`) }).catch(() => {});
      await writeFile(path.join(artifacts, `failure-${index}-${pageIndex}.txt`), await page.locator("body").innerText().catch(() => ""));
    }
  }
  throw error;
} finally {
  await browser.close();
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
}
