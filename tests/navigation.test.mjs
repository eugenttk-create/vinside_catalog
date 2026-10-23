import assert from "node:assert/strict";
import { beforeEach, afterEach, test } from "node:test";

class Browser extends EventTarget {
  constructor(href = "https://shop.test/catalog?shopFilter=active#products") {
    super();
    this.location = new URL(href);
    this.entries = [{ href, state: { shopState: "preserved" } }];
    this.index = 0;
    const browser = this;
    this.history = {
      get state() {
        return structuredClone(browser.entries[browser.index].state);
      },
      get length() {
        return browser.entries.length;
      },
      pushState(state, _, url) {
        browser.entries.splice(browser.index + 1);
        browser.entries.push({
          href: String(url),
          state: structuredClone(state),
        });
        browser.index++;
        browser.location = new URL(url);
      },
      replaceState(state, _, url) {
        browser.entries[browser.index] = {
          href: String(url),
          state: structuredClone(state),
        };
        browser.location = new URL(url);
      },
      go(delta) {
        const next = browser.index + delta;
        if (next < 0 || next >= browser.entries.length) return;
        browser.index = next;
        browser.location = new URL(browser.entries[next].href);
        queueMicrotask(() => browser.dispatchEvent(new Event("popstate")));
      },
      back() {
        this.go(-1);
      },
      forward() {
        this.go(1);
      },
    };
  }
}

globalThis.window = new Browser();
globalThis.self = globalThis;
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
globalThis.document = { getElementById: () => null };

const { default: store } = await import("../src/store/store.ts");
const { default: api } = await import("../src/api/api.ts");
const { emptyRoute, catalogRouteUrl, readCatalogRoute, NAV_PARAM, PATH_PARAM } =
  await import("../src/navigation/catalogRoute.ts");
const {
  startCatalogNavigation,
  navigateToCatalogRoute,
  navigateToCatalogBreadcrumb,
  routeFromState,
} = await import("../src/navigation/catalogNavigation.ts");
const { restoreCatalogRoute } =
  await import("../src/navigation/restoreCatalogRoute.ts");
const { addBreadcrumb, trimBreadcrumbs, resetBreadcrumbs, replaceBreadcrumbs } =
  await import("../src/store/breadcrumbs/breadcrumbsSlice.ts");
const { openCatalog, closeCatalog, setCatalogId, setSelectedBrand } =
  await import("../src/store/models/modelsSlice.ts");
const { setCarId } = await import("../src/store/parameters/parametersSlice.ts");
const { fetchParameters } =
  await import("../src/store/parameters/parametersThunks.ts");
const { fetchParts } = await import("../src/store/parts/partsThunks.ts");
const { setTheme, setPalette } = await import("../src/store/theme/themeSlice.ts");
const { palettes, getSavedPalette } = await import("../src/store/theme/palettes.ts");

const crumb = (type, id, name = id) => ({ type, id, name });
const parameters = ["pl_year", "pl_engine", "pl_gearbox", "pl_steering"];
const modelPath = [crumb("model", "model1", "Model One")];
const selectedPath = [
  ...modelPath,
  ...parameters.map((id) => crumb("parameter", id)),
];
const groupsPath = [
  ...selectedPath,
  crumb("group", "group1"),
  crumb("group", "group2"),
];
const partsPath = [...groupsPath, crumb("part", "parts1", "Parts drawing")];
const analogsPath = [...partsPath, crumb("analogs", "AB:12 / +&?")];
const detailPath = [...analogsPath, crumb("analog-detail", "42")];
const route = (breadcrumbs, extra = {}) => ({
  ...emptyRoute(true),
  catalogId: "brand1",
  brand: "Brand One",
  breadcrumbs,
  ...extra,
});
const partData = (id) => ({
  img: [],
  partGroups: [{ name: id, parts: [] }],
  marker: id,
});
const paramList = (count, all = false) =>
  Array.from({ length: count }, (_, index) => ({
    key: `key${index}`,
    name: `Parameter ${index}`,
    sortOrder: index,
    values: [
      {
        idx: all ? `value${index}` : (parameters[index] ?? `pl_extra${index}`),
        value: `Value ${index}`,
        img: "",
        description: null,
      },
    ],
  }));
const group = (id, hasSubgroups = true) => ({
  id,
  name: id,
  hasSubgroups,
  hasParts: !hasSubgroups,
  img: "",
  scope: null,
  description: null,
});
let requests;
let mode;
let cleanup;
let modelId;
let holdRequest;
let recursiveDepth;

api.defaults.adapter = async (config) => {
  const url = new URL(config.url, "https://catalog.test");
  requests.push({ url, body: config.data });
  if (holdRequest) await holdRequest(url);
  let data;
  if (url.pathname === "/catalogs/")
    data = [{ id: "brand1", name: "Brand One", img: "" }];
  else if (url.pathname.endsWith("/models/"))
    data = [{ id: "model1", name: "Model One", img: "", description: null }];
  else if (url.pathname.includes("cars-parameters")) {
    const count = url.searchParams.getAll("parameter").length;
    data =
      mode === "none"
        ? []
        : mode === "all"
          ? paramList(3, true)
          : paramList(Math.min(count + 1, recursiveDepth));
  } else if (url.pathname.includes("cars2")) data = [{ id: "car1" }];
  else if (url.pathname.includes("parts2"))
    data = partData(url.searchParams.get("groupId"));
  else if (url.pathname.includes("groups2")) {
    const id = url.searchParams.get("groupId");
    data =
      id === "group1"
        ? [group("group2")]
        : id === "group2"
          ? [group("parts1", false)]
          : [group("group1")];
  } else if (url.pathname === "/car/info")
    data = [
      { catalogId: "brand1", carId: "car1", vin: url.searchParams.get("q") },
    ];
  else if (url.pathname === "/car/vin-info")
    data = [
      {
        brand: "Brand One",
        carId: "car1",
        model: "Model One",
        vin: url.searchParams.get("q"),
        parameters: [],
        optionCodes: [],
      },
    ];
  else if (url.pathname === "/search/pb")
    data = { oe_number: url.searchParams.get("query"), cars: [] };
  else if (url.pathname === "/search/pb/groups")
    data = [group("parts1", false)];
  else if (url.pathname === "/search/pb/parts") data = partData("oe-parts");
  else if (url.pathname.includes("/ai"))
    data =
      url.searchParams.get("query") === "direct"
        ? partData("search-parts")
        : [group("parts1", false)];
  else if (url.pathname === "/crossdoc/getAnalogs")
    data = [
      {
        id: 42,
        brand: "Analog Brand",
        articleNumber: "XYZ",
        genericArticleIds: [7],
        name: "Analog",
        description: "",
      },
    ];
  else if (url.pathname === "/crossdoc/getAnalogInfo")
    data = {
      name: "Analog",
      articleId: 42,
      brands: [{ id: 1, brand: "Brand" }],
    };
  else throw new Error(`Unexpected request: ${url}`);
  return { data, status: 200, statusText: "OK", headers: {}, config };
};

const settle = async () => {
  for (let i = 0; i < 8; i++) await new Promise(setImmediate);
};
const start = () => {
  cleanup = startCatalogNavigation((id) => {
    modelId = id;
  });
};
const load = async (value) => {
  await restoreCatalogRoute(store, value, new AbortController().signal);
  await settle();
};
const lastType = () => store.getState().breadcrumbs.breadcrumbs.at(-1)?.type;
const assertClean = () =>
  assert.equal(store.getState().notifications.notifications.length, 0);

beforeEach(() => {
  globalThis.window = new Browser();
  store.dispatch({ type: "RESET_STORE" });
  requests = [];
  mode = "recursive";
  recursiveDepth = 4;
  holdRequest = undefined;
  modelId = "";
});
afterEach(() => {
  cleanup?.();
  cleanup = undefined;
});

test("URL round trip preserves the full recursive path, special characters, host query and hash", () => {
  const original = route(detailPath, { carId: "car1" });
  const url = catalogRouteUrl(window.location.href, original);
  assert.deepEqual(readCatalogRoute(url), original);
  assert.equal(new URL(url).searchParams.get("shopFilter"), "active");
  assert.equal(new URL(url).hash, "#products");
});

test("closing removes only catalog parameters", () => {
  const url = catalogRouteUrl(
    catalogRouteUrl(window.location.href, route(partsPath)),
    emptyRoute(),
  );
  assert.equal(new URL(url).searchParams.has(NAV_PARAM), false);
  assert.equal(new URL(url).searchParams.has(PATH_PARAM), false);
  assert.equal(new URL(url).searchParams.get("shopFilter"), "active");
});

test("catalogNav can select an ancestor from a shared path, including the parts alias", () => {
  const url = new URL(catalogRouteUrl(window.location.href, route(detailPath)));
  url.searchParams.set(NAV_PARAM, "parts:parts1");
  assert.deepEqual(readCatalogRoute(url.href).breadcrumbs, partsPath);
  url.searchParams.set(NAV_PARAM, "brand:brand1");
  assert.deepEqual(readCatalogRoute(url.href).breadcrumbs, []);
});

test("malformed paths and unsupported/ambiguous legacy URLs are rejected safely", () => {
  for (const query of [
    "catalogPath=invalid",
    "catalogPath=null",
    "catalogPath=%7B%7D",
    "catalogNav=unknown:1",
    "catalogNav=part:1",
    "catalogNav=model:",
  ]) {
    assert.equal(readCatalogRoute(`https://shop.test/?${query}`), null);
  }
  const url = new URL(catalogRouteUrl(window.location.href, route(partsPath)));
  url.searchParams.set(NAV_PARAM, "part:missing");
  assert.equal(readCatalogRoute(url.href), null);
});

test("legacy brand and parts links with explicit vehicle context are supported", async () => {
  await load(readCatalogRoute("https://shop.test/?catalogNav=brand:brand1"));
  assert.equal(store.getState().models.selectedBrand, "Brand One");
  await load(
    readCatalogRoute(
      "https://shop.test/?catalogNav=parts:parts1&catalogId=brand1&carId=car1",
    ),
  );
  assert.equal(store.getState().parts.parts.marker, "parts1");
  assertClean();
});

for (const [name, path] of [
  ["brand", []],
  ["model", modelPath],
  ...parameters.map((_, i) => [
    `parameter ${i + 1}`,
    selectedPath.slice(0, i + 2),
  ]),
  ["group", groupsPath.slice(0, -1)],
  ["subgroup", groupsPath],
  ["parts", partsPath],
  ["analogs", analogsPath],
  ["analog detail", detailPath],
]) {
  test(`fresh URL restores ${name} without an existing Redux path`, async () => {
    window.location = new URL(
      catalogRouteUrl(window.location.href, route(path)),
    );
    start();
    await settle();
    assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, path);
    assert.equal(store.getState().models.catalogId, "brand1");
    assert.equal(store.getState().models.catalogOpened, true);
    assert.equal(modelId, path.length ? "model1" : "");
    if (name.startsWith("parameter"))
      assert.deepEqual(
        store.getState().parameters.selectedParameters,
        parameters.slice(0, path.length - 1),
      );
    if (name === "parts")
      assert.equal(store.getState().parts.parts.marker, "parts1");
    if (name === "analogs")
      assert.equal(store.getState().analogs.isAnalogsView, true);
    if (name === "analog detail") {
      assert.equal(store.getState().analogs.isAnalogDetailView, true);
      assert.equal(store.getState().analogs.selectedAnalog.id, 42);
      assert.equal(store.getState().analogs.analogInfo.articleId, 42);
    }
    assert.equal(window.history.length, 1);
    assertClean();
  });
}

for (let index = -1; index < partsPath.length; index++) {
  test(`every breadcrumb is reachable from analogs: index ${index}`, async () => {
    start();
    await navigateToCatalogRoute(route(analogsPath));
    await navigateToCatalogBreadcrumb(index);
    await settle();
    assert.deepEqual(
      store.getState().breadcrumbs.breadcrumbs,
      partsPath.slice(0, index + 1),
    );
    assert.equal(store.getState().analogs.isAnalogsView, false);
    if (index === partsPath.length - 1)
      assert.equal(store.getState().parts.parts.marker, "parts1");
    assertClean();
  });
}

test("all-at-once parameters restore exact selections and open groups only when complete", async () => {
  mode = "all";
  const path = [
    ...modelPath,
    crumb("parameter", "value0"),
    crumb("parameter", "value1"),
    crumb("parameter", "value2"),
  ];
  await load(route(path));
  assert.equal(store.getState().parameters.carId, "car1");
  await load(route(path.slice(0, -1)));
  assert.deepEqual(store.getState().parameters.selectedParameters, [
    "value0",
    "value1",
  ]);
  assert.equal(store.getState().parameters.carId, null);
  assert.equal(store.getState().groups.groupsFlat.length, 0);
  assertClean();
});

test("recursive restrictions are not limited to a fixed number of steps", async () => {
  recursiveDepth = 16;
  const selections = Array.from(
    { length: recursiveDepth },
    (_, index) => parameters[index] ?? `pl_extra${index}`,
  );
  const path = [
    ...modelPath,
    ...selections.map((id) => crumb("parameter", id)),
    crumb("part", "parts1"),
  ];
  start();
  await navigateToCatalogRoute(route(path));
  assert.deepEqual(store.getState().parameters.selectedParameters, selections);
  assert.equal(store.getState().parts.parts.marker, "parts1");
  await navigateToCatalogBreadcrumb(9);
  assert.deepEqual(
    store.getState().parameters.selectedParameters,
    selections.slice(0, 9),
  );
  assert.equal(store.getState().parameters.carId, null);
  assertClean();
});

test("repeated parameter IDs preserve their position in the path", async () => {
  const path = [
    ...modelPath,
    crumb("parameter", "pl_same", "First"),
    crumb("parameter", "pl_same", "Second"),
  ];
  start();
  await navigateToCatalogRoute(route(path));
  await navigateToCatalogBreadcrumb(1);
  assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, path.slice(0, 2));
  window.history.back();
  await settle();
  assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, path);
  assert.deepEqual(store.getState().parameters.selectedParameters, [
    "pl_same",
    "pl_same",
  ]);
  assertClean();
});

test("models without restrictions resolve car and groups", async () => {
  mode = "none";
  await load(route(modelPath));
  assert.equal(store.getState().parameters.carId, "car1");
  assert.equal(store.getState().groups.groupsFlat[0].id, "group1");
  assertClean();
});

test("Back/Forward traverses every stage and the closed widget without losing forward history", async () => {
  start();
  const paths = [
    [],
    modelPath,
    ...parameters.map((_, i) => selectedPath.slice(0, i + 2)),
    groupsPath.slice(0, -1),
    groupsPath,
    partsPath,
    analogsPath,
    detailPath,
  ];
  for (const path of paths) await navigateToCatalogRoute(route(path));
  const length = window.history.length;
  for (let i = paths.length - 2; i >= 0; i--) {
    window.history.back();
    await settle();
    assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, paths[i]);
  }
  window.history.back();
  await settle();
  assert.equal(store.getState().models.catalogOpened, false);
  for (const path of paths) {
    window.history.forward();
    await settle();
    assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, path);
    assert.equal(store.getState().models.catalogOpened, true);
  }
  assert.equal(window.history.length, length);
  assertClean();
});

test("breadcrumb click creates a normal history entry; Back restores analogs and Forward restores parts", async () => {
  start();
  await navigateToCatalogRoute(route(analogsPath));
  const requestsBefore = requests.length;
  await navigateToCatalogBreadcrumb(partsPath.length - 1);
  assert.equal(
    requests.length,
    requestsBefore,
    "returning to a loaded drawing should not refetch the vehicle",
  );
  assert.equal(lastType(), "part");
  window.history.back();
  await settle();
  assert.equal(lastType(), "analogs");
  assert.equal(store.getState().analogs.isAnalogsView, true);
  window.history.forward();
  await settle();
  assert.equal(lastType(), "part");
  assert.equal(store.getState().analogs.isAnalogsView, false);
  assertClean();
});

test("normal Redux selections, same-tick trim/add and home produce one history entry each", async () => {
  start();
  store.dispatch(setCatalogId("brand1"));
  store.dispatch(setSelectedBrand("Brand One"));
  store.dispatch(openCatalog());
  await settle();
  assert.equal(window.history.length, 2);
  store.dispatch(addBreadcrumb(modelPath[0]));
  await settle();
  assert.equal(window.history.length, 3);
  store.dispatch(addBreadcrumb(crumb("parameter", "old")));
  await settle();
  store.dispatch(trimBreadcrumbs(0));
  store.dispatch(addBreadcrumb(crumb("parameter", "new")));
  await settle();
  assert.equal(window.history.length, 5);
  assert.equal(
    readCatalogRoute(window.location.href).breadcrumbs.at(-1).id,
    "new",
  );
  store.dispatch(resetBreadcrumbs());
  store.dispatch(closeCatalog());
  await settle();
  assert.equal(window.history.length, 6);
  assert.equal(
    new URL(window.location.href).searchParams.has(NAV_PARAM),
    false,
  );
  assert.equal(window.history.state.shopState, "preserved");
});

test("resolved car context replaces the current entry without creating another navigation step", async () => {
  start();
  await navigateToCatalogRoute(route(partsPath));
  const length = window.history.length;
  store.dispatch(setCarId("updated-car"));
  await settle();
  assert.equal(window.history.length, length);
  assert.equal(readCatalogRoute(window.location.href).carId, "updated-car");
});

test("saved URL restores after clearing all Redux data, with the same host URL", async () => {
  start();
  await navigateToCatalogRoute(route(partsPath));
  const url = window.location.href;
  cleanup();
  cleanup = undefined;
  store.dispatch({ type: "RESET_STORE" });
  window = new Browser(url);
  start();
  await settle();
  assert.equal(store.getState().parts.parts.marker, "parts1");
  assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, partsPath);
  assert.equal(window.location.hash, "#products");
  assertClean();
});

test("choosing a new branch after Back discards the old Forward branch", async () => {
  start();
  await navigateToCatalogRoute(route(partsPath));
  await navigateToCatalogRoute(route(analogsPath));
  window.history.back();
  await settle();
  await navigateToCatalogBreadcrumb(0);
  window.history.forward();
  await settle();
  assert.equal(lastType(), "model");
  assert.equal(store.getState().analogs.isAnalogsView, false);
  assertClean();
});

test("rapid navigation cancels the old restoration so its late response cannot overwrite the target", async () => {
  start();
  let release;
  holdRequest = (url) =>
    url.pathname.endsWith("/models/")
      ? new Promise((resolve) => {
          release = resolve;
        })
      : undefined;
  const oldNavigation = navigateToCatalogRoute(route(partsPath));
  await settle();
  holdRequest = undefined;
  await navigateToCatalogRoute(emptyRoute(true));
  release();
  await oldNavigation;
  await settle();
  assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, []);
  assert.equal(store.getState().models.models.length, 0);
  assert.equal(store.getState().parts.parts.partGroups.length, 0);
  assertClean();
});

test("cancelling a legacy VIN restoration also cancels its nested group request", async () => {
  start();
  let release;
  holdRequest = (url) =>
    url.pathname.includes("groups2")
      ? new Promise((resolve) => {
          release = resolve;
        })
      : undefined;
  const oldNavigation = navigateToCatalogRoute({
    ...emptyRoute(true),
    breadcrumbs: [crumb("vin", "XW8AN2NE3JH035743")],
  });
  await settle();
  assert.equal(typeof release, "function");
  holdRequest = undefined;
  await navigateToCatalogRoute(emptyRoute(true));
  release();
  await oldNavigation;
  await settle();
  assert.deepEqual(store.getState().breadcrumbs.breadcrumbs, []);
  assert.equal(store.getState().groups.groupsFlat.length, 0);
  assert.equal(store.getState().parameters.carId, null);
  assert.equal(
    requests.filter((item) => item.url.pathname.includes("vin-info")).length,
    0,
  );
  assertClean();
});

test("host-only Back/Forward preserves host state and does not add catalog entries", async () => {
  start();
  await navigateToCatalogRoute(route(partsPath));
  const url = new URL(window.location.href);
  url.searchParams.set("shopFilter", "updated");
  window.history.pushState(
    { ...window.history.state, shopState: "updated" },
    "",
    url.href,
  );
  const length = window.history.length;
  window.history.back();
  await settle();
  window.history.forward();
  await settle();
  assert.equal(window.history.length, length);
  assert.equal(window.history.state.shopState, "updated");
  assert.equal(
    new URL(window.location.href).searchParams.get("shopFilter"),
    "updated",
  );
  assert.equal(store.getState().parts.parts.marker, "parts1");
  assertClean();
});

test("Back cancels a request started by a normal detail click before navigation", async () => {
  start();
  await navigateToCatalogRoute(route(groupsPath));
  let release;
  holdRequest = (url) =>
    url.pathname.includes("parts2")
      ? new Promise((resolve) => {
          release = resolve;
        })
      : undefined;
  const request = store.dispatch(
    fetchParts({ catalogId: "brand1", carId: "car1", groupId: "parts1" }),
  );
  store.dispatch(addBreadcrumb(crumb("part", "parts1")));
  await settle();
  window.history.back();
  await settle();
  assert.equal(lastType(), "group");
  release();
  const action = await request;
  await settle();
  assert.equal(action.meta.aborted, true);
  assert.equal(store.getState().parts.parts.partGroups.length, 0);
  assert.equal(lastType(), "group");
  assertClean();
});

test("returning from analogs never reuses a drawing loaded for another group", async () => {
  await load(route(partsPath));
  const differentPath = [...groupsPath, crumb("part", "different-group")];
  store.dispatch(
    replaceBreadcrumbs([...differentPath, crumb("analogs", "ABC")]),
  );
  await load(route(differentPath, { carId: "car1" }));
  assert.equal(store.getState().parts.parts.marker, "different-group");
  assert.equal(store.getState().parts.loadedGroupId, "different-group");
  assertClean();
});

const vinPath = [crumb("vin", "XW8AN2NE3JH035743")];
for (const [name, path] of [
  ["VIN", vinPath],
  ["VIN group", [...vinPath, crumb("group", "group1")]],
  ["VIN parts", [...vinPath, crumb("part", "parts1")]],
  ["AI groups", [...vinPath, crumb("search", "brake")]],
  ["AI direct parts", [...vinPath, crumb("parts-search", "direct")]],
  [
    "AI filtered parts",
    [...vinPath, crumb("search", "brake"), crumb("part", "parts1")],
  ],
]) {
  test(`navigation preserves ${name} behavior`, async () => {
    await load(route(path, { carId: "car1", regionId: "eu" }));
    assert.equal(store.getState().models.isVinSearch, true);
    assert.equal(store.getState().parameters.carId, "car1");
    assert.equal(store.getState().groups.vinRegionId, "eu");
    if (name === "AI direct parts")
      assert.equal(store.getState().parts.parts.marker, "search-parts");
    if (name === "AI filtered parts")
      assert.equal(
        requests
          .find((item) => item.url.pathname.includes("parts2"))
          .url.searchParams.get("query"),
        "brake",
      );
    assertClean();
  });
}

const oePath = [crumb("oe", "5Q0407365A")];
for (const [name, path] of [
  ["OE", oePath],
  ["OE group", [...oePath, crumb("oe-group", "car1")]],
  ["OE parts", [...oePath, crumb("oe-group", "car1"), crumb("part", "parts1")]],
  [
    "OE analogs",
    [
      ...oePath,
      crumb("oe-group", "car1"),
      crumb("part", "parts1"),
      crumb("analogs", "ABC"),
    ],
  ],
]) {
  test(`navigation preserves ${name} behavior`, async () => {
    await load(route(path));
    assert.equal(store.getState().OE.isOESearch, true);
    assert.equal(store.getState().OE.OE.oe_number, "5Q0407365A");
    if (name === "OE parts")
      assert.equal(store.getState().parts.parts.marker, "oe-parts");
    assertClean();
  });
}

test("parameter reducer restores forced selection and keeps the final recursive selection", async () => {
  for (let i = 0; i <= parameters.length; i++) {
    await store
      .dispatch(
        fetchParameters({
          catalogId: "brand1",
          modelId: "model1",
          selectedParameters: parameters.slice(0, i),
        }),
      )
      .unwrap();
  }
  assert.deepEqual(store.getState().parameters.selectedParameters, parameters);
  await store
    .dispatch(
      fetchParameters({
        catalogId: "brand1",
        modelId: "model1",
        selectedParameters: parameters.slice(0, 1),
      }),
    )
    .unwrap();
  assert.deepEqual(
    store.getState().parameters.selectedParameters,
    parameters.slice(0, 1),
  );
});

test("StrictMode setup/cleanup/setup leaves one functioning history listener", async () => {
  const url = catalogRouteUrl(window.location.href, route(partsPath));
  window = new Browser(url);
  start();
  cleanup();
  start();
  await settle();
  assert.equal(store.getState().parts.parts.marker, "parts1");
  assert.equal(window.history.length, 1);
  assert.equal(
    routeFromState(store.getState()).breadcrumbs.at(-1).type,
    "part",
  );
  assertClean();
});

test("all palettes propagate with both modes only to widget-owned roots", () => {
  const element = (owned) => ({
    attributes: new Map(owned ? [["data-carcat-root", ""]] : []),
    hasAttribute(name) { return this.attributes.has(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
  });
  const widget = element(true), portal = element(true), host = element(false);
  const previousDocument = document;
  window.__WIDGET_ROOT__ = widget;
  window.__WIDGET_PORTAL_ROOT__ = portal;
  globalThis.document = { getElementById: () => host };
  try {
    for (const mode of ["light", "dark"]) for (const palette of palettes) {
      store.dispatch(setTheme(mode)); store.dispatch(setPalette(palette.id));
      assert.deepEqual(store.getState().theme, { mode, palette: palette.id });
      for (const root of [widget, portal]) {
        assert.equal(root.attributes.get("data-carcat-theme"), mode);
        assert.equal(root.attributes.get("data-carcat-palette"), palette.id);
      }
    }
    assert.equal(host.attributes.size, 0);
  } finally { globalThis.document = previousDocument; }
});

test("an unknown saved palette falls back to the original blue palette", () => {
  const previousStorage = localStorage;
  try {
    globalThis.localStorage = { getItem: () => "unknown" };
    assert.equal(getSavedPalette(), "blue");
    globalThis.localStorage = { getItem: () => "violet" };
    assert.equal(getSavedPalette(), "violet");
  } finally { globalThis.localStorage = previousStorage; }
});
