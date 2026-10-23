import assert from "node:assert/strict";
import * as fixture from "./fixtures.mjs";
import { translations } from "../../src/utils/translation.js";

const modelDescription = { model_type: "Sedan", year_from: "1991", year_to: "1994", series: "C4", code: "4A" };
const yearDescription = { year_from: "1991", year_to: "1994", code: "YR", pic: "01", sales_term: "Europe" };
const engineDescription = { code: "ABK", pic: "02", cabin: "Saloon" };
const groupDescription = { subgroup: "10", code: "ENG", referenceNr: "R1", illustration: "001", from: "01/02/94" };
const subgroupDescription = { subgroup: "20", code: "SUB", illustration: "002" };

export async function checkFieldOrder({ newPage, origin, directory, waitForIdle }) {
  for (const width of [1440, 390]) {
    for (const language of ["en", "ru"]) {
      const page = await newPage(origin, directory, { width, height: 1000 });
      const t = translations[language];
      await page.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const pathname = url.pathname;
        if (request.method() === "OPTIONS" || !["xhr", "fetch"].includes(request.resourceType()) ||
            !/models\/|cars-parameters|groups2/.test(pathname)) return route.fallback();
        const data = structuredClone(fixture.apiResponse(url, request.postData()));
        if (pathname.endsWith("/models/")) {
          data[0].description = modelDescription;
          data[1].description = { model_type: "Wagon", year_from: "1992" };
          data[2].description = { code: "CODE-ONLY" };
        } else if (pathname.includes("cars-parameters")) {
          data.forEach((parameter) => {
            parameter.values[0].description = parameter.key === "year" ? yearDescription : engineDescription;
          });
        } else {
          data[0].description = url.searchParams.has("groupId") ? subgroupDescription : groupDescription;
        }
        await route.fulfill({ json: data, headers: { "access-control-allow-origin": origin, "access-control-allow-credentials": "true" } });
      });
      const cases = [
        { path: [], name: "models", headings: [t.widget_code, t.widget_series, "", t.widget_name, t.widget_model_type, t.widget_production_period],
          cells: ["4A", "C4", "", "Audi 100", "Sedan", "1991 — 1994"], popup: [t.widget_code, t.widget_series, t.widget_model_type, t.widget_production_period] },
        { path: fixture.modelPath, name: "year", headings: [t.widget_code, t.widget_pic, "", t.widget_name, t.widget_production_period, t.widget_sales_term],
          cells: ["YR", "01", "", "1994", "1991 — 1994", "Europe"], popup: [t.widget_code, t.widget_pic, t.widget_production_period, t.widget_sales_term] },
        { path: fixture.yearPath, name: "engine", headings: [t.widget_code, t.widget_pic, "", t.widget_name, t.widget_cabin],
          cells: ["ABK", "02", "", "2.0 petrol", "Saloon"], popup: [t.widget_code, t.widget_pic, t.widget_cabin] },
        { path: fixture.vehiclePath, name: "groups", headings: [t.widget_code, "", t.widget_name, t.widget_subgroup, t.widget_reference, t.widget_illustration, t.widget_from],
          cells: ["ENG", "", "Engine", "10", "R1", "001", "01/02/94"], popup: [t.widget_code, t.widget_subgroup, t.widget_reference, t.widget_illustration, t.widget_from] },
        { path: fixture.groupPath, name: "subgroups", headings: [t.widget_code, "", t.widget_name, t.widget_subgroup, t.widget_illustration],
          cells: ["SUB", "", "Engine assembly", "20", "002"], popup: [t.widget_code, t.widget_subgroup, t.widget_illustration] },
      ];
      for (const scenario of cases) {
        const url = new URL(fixture.routeUrl(origin, scenario.path));
        url.searchParams.set("language", language);
        await page.goto(url.href);
        await waitForIdle(page);
        if (width < 768) {
          const toggle = page.locator('button[class*="sidebar__toggle"]');
          if (await toggle.isVisible()) await toggle.click();
        }
        const switches = page.locator('button[class*="cards-section__switch-button"]');
        if (!(await switches.nth(1).getAttribute("class")).includes("switch-button_active")) {
          await switches.nth(1).click();
        }
        const table = page.locator('#catalog-root table[class*="table_ordered"]').first();
        await table.waitFor();
        assert.deepEqual(await table.locator("thead th").allTextContents(), scenario.headings, `${scenario.name}: headings (${width}, ${language})`);
        assert.deepEqual(await table.locator("tbody tr").first().locator("td").allTextContents(), scenario.cells, `${scenario.name}: values no longer match their headings`);
        assert.deepEqual(await table.locator('img[class*="table-image"]').first().evaluate((image) => ({ width: image.width, height: image.height })), { width: 40, height: 40 });
        const firstCell = await table.locator("tbody tr td").first().evaluate((cell) => ({ align: getComputedStyle(cell).textAlign, padding: getComputedStyle(cell).padding }));
        assert.deepEqual(firstCell, { align: "left", padding: "8px 24px" }, "Code inherited thumbnail-column styling");
        assert.equal(await table.locator("tbody tr").nth(1).locator("td").first().textContent(), "—", "Missing priority value must keep its column");
        await switches.first().click();
        await page.locator('button[class*="__info-icon"]').first().click();
        const popup = page.locator('[class*="info-popup_active"]').first();
        await popup.waitFor();
        assert.deepEqual(await popup.locator('[class*="info-popup__title"]').allTextContents(), scenario.popup, `${scenario.name}: card field order`);
        if (scenario.name === "groups") assert.equal(await popup.locator('[class*="info-popup__text"]').last().textContent(), "02.01.2094", "Date formatting changed");
        await popup.locator("button").first().click();
        if (scenario.name === "models") {
          const codeOnly = page.locator('[class*="catalog-group-card"]').filter({ hasText: "Audi 80" });
          await codeOnly.locator('button[class*="__info-icon"]').click();
          assert.deepEqual(await popup.locator('[class*="info-popup__title"]').allTextContents(), [t.widget_code]);
          assert.deepEqual(await popup.locator('[class*="info-popup__text"]').allTextContents(), ["CODE-ONLY"]);
        }
      }
      await page.close();
    }
  }
  console.log("Field ordering, matching cells, card details, missing fields and thumbnail sizing passed (desktop/mobile, English/Russian).");
}
