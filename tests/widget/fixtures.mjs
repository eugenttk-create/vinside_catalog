export const image = "https://widget-fixture.test/drawing.svg";
export const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="white"/><g fill="none" stroke="#354457" stroke-width="3"><path d="M100 160h330l70 60v60H90v-90z"/><path d="M160 160l50-70h160l60 70M290 90v70"/><circle cx="170" cy="280" r="48"/><circle cx="425" cy="280" r="48"/><path d="M310 220h70v35h-70z"/></g><g fill="#075985" font-family="Arial" font-size="20"><text x="160" y="370">1</text><text x="330" y="215">2</text></g></svg>`;

export const brand = { id: "audi", name: "Audi", img: image };
export const catalogs = [brand, ...["BMW", "Mercedes", "Toyota", "Nissan", "Volkswagen"].map((name) => ({ id: name.toLowerCase(), name, img: image }))];
export const models = ["Audi 100", "Audi A6", "Audi 80"].map((name, index) => ({ id: `model${index + 1}`, name, img: image, description: null }));
const value = (idx, value) => ({ idx, value, img: image, description: null });
export const parameters = [
  { key: "year", name: "Year", sortOrder: 1, values: [value("pl_1994", "1994"), value("pl_1993", "1993")] },
  { key: "engine", name: "Engine", sortOrder: 2, values: [value("pl_20", "2.0 petrol"), value("pl_23", "2.3 petrol")] },
];
const group = (id, name, hasSubgroups) => ({ id, name, hasSubgroups, hasParts: !hasSubgroups, img: image, scope: "Parts", description: null });
export const groups = [group("group1", "Engine", true), group("group2", "Chassis", true)];
export const subgroups = [group("parts1", "Engine assembly", false), group("parts2", "Fuel system", false)];
export const parts = {
  img: [image, image + "?second"], imgDescription: "Engine assembly",
  positions: [
    { number: "1", coordinates: [100, 245, 220, 315], img: image },
    { number: "2", coordinates: [300, 205, 390, 265], img: image },
  ],
  partGroups: [{ name: "Engine assembly", description: "", number: "1", positionNumber: "1", parts: [
    { id: "part1", name: "Wheel bearing", number: "8A0407625", notice: "", positionNumber: "1", url: "", description: { qty: "2", remark: "For vehicles with ABS", year_from: "1991", year_to: "1994" } },
    { id: "part2", name: "Mounting bracket", number: "4A0199308", notice: "", positionNumber: "2", url: "", description: { qty: "1", remark: "Left side" } },
  ] }],
};
export const analogs = [{ id: 42, articleNumber: "VKBA 1355", genericArticleIds: [654], name: "Wheel bearing kit", brand: "SKF", description: "Front axle" }, { id: 43, articleNumber: "713 6100 20", genericArticleIds: [654], name: "Wheel bearing kit", brand: "FAG", description: "Front axle" }];
export const vin = "XW8AN2NE3JH035743";
export const vinInfo = { vin, brand: "Audi", model: "Audi 100", carId: "car1", parameters: [{ key: "Engine", value: "2.0 petrol", description: "ABK" }], optionCodes: [{ key: "1AT", value: "ABS", description: "Electronic stabilization program" }] };

const crumb = (type, id, name = id) => ({ type, id, name });
export const modelPath = [crumb("model", "model1", "Audi 100")];
export const yearPath = [...modelPath, crumb("parameter", "pl_1994", "1994")];
export const vehiclePath = [...yearPath, crumb("parameter", "pl_20", "2.0 petrol")];
export const groupPath = [...vehiclePath, crumb("group", "group1", "Engine")];
export const partsPath = [...groupPath, crumb("part", "parts1", "Engine assembly")];
export const analogsPath = [...partsPath, crumb("analogs", "8A0407625")];
export const detailPath = [...analogsPath, crumb("analog-detail", "42", "SKF VKBA 1355")];
export const vinPath = [crumb("vin", vin)];
export const oePath = [crumb("oe", "8A0407625")];

export function routeUrl(origin, path, host = true) {
  const url = new URL(host ? "/host.html" : "/", origin);
  const route = { version: 1, opened: true, catalogId: "audi", brand: "Audi", breadcrumbs: path };
  if (path.some((item) => ["part", "group", "vin"].includes(item.type))) route.carId = "car1";
  const last = path.at(-1);
  url.searchParams.set("catalogNav", last ? `${last.type}:${last.id}` : "brand:audi");
  url.searchParams.set("catalogPath", JSON.stringify(route));
  return url.href;
}

export function apiResponse(url, body) {
  url = new URL(url);
  url.pathname = url.pathname.replace(/^\/v\d+\//, "/");
  if (url.pathname === "/catalogs/") return catalogs;
  if (url.pathname.endsWith("/models/")) return models;
  if (url.pathname.includes("cars-parameters")) return parameters.slice(0, Math.min(url.searchParams.getAll("parameter").length + 1, 2));
  if (url.pathname.includes("cars2")) return [{ id: "car1" }];
  if (url.pathname.includes("groups2")) return url.searchParams.has("groupId") ? subgroups : groups;
  if (url.pathname.includes("parts2")) return parts;
  if (url.pathname === "/car/info") return [{ catalogId: "audi", carId: "car1", vin }];
  if (url.pathname === "/car/vin-info") return [vinInfo];
  if (url.pathname === "/search/pb") return { oe_number: "8A0407625", models: [{ carId: "car1", brand: "Audi", model: "Audi 100", year: "1994" }] };
  if (url.pathname === "/search/pb/groups") return subgroups;
  if (url.pathname === "/search/pb/parts") return parts;
  if (url.pathname.endsWith("/ai")) return body?.includes("direct") ? parts : subgroups;
  if (url.pathname === "/crossdoc/getAnalogs") return analogs;
  if (url.pathname === "/crossdoc/getAnalogInfo") return { name: "Wheel bearing kit", brand: "SKF", articleNumber: "VKBA 1355", articleId: 42, code: "654", info: "Front axle", quantityPerPackage: 1, quantityPerPartPerPackage: "1", replacesArticles: "", criteria: [{ description: "Width", value: "37 mm" }], brands: [{ id: 1, brand: "Audi" }] };
  if (url.pathname === "/crossdoc/getApplicability") return [{ model: "Audi 100", carId: 1, engine: "2.0", fuelType: "Petrol", powerKw: 85, powerHp: 115, cylinderCapacity: 1984, criteria: [] }];
  throw new Error(`Unexpected API endpoint: ${url.pathname}`);
}

export const hostCss = `
body { margin:0; }
#host-shell { width:100%; }
#embed-position { position:absolute; top:80px; left:0; width:100%; }
#embed-position::before, #embed-position::after { content:none; }
#host-probe { padding:8px; color:#333; font:14px/20px Georgia; text-align:left; }
#host-probe button { color:#123456; background:#fedcba; padding:3px 7px; border:2px solid #999; }
#host-probe a { color:#a02040; }
#host-probe table { border-collapse:separate; }
`;
export const hostileCss = `
html { font-size:25px; line-height:1.8; --blue:magenta; --white:yellow; --text-color:red; }
body { font:700 23px/1.8 Georgia; color:purple; text-align:right; letter-spacing:3px; }
* { box-sizing:border-box; font-family:Georgia; letter-spacing:3px; text-transform:uppercase; }
*::before { content:"HOST"; color:red; }
#host-shell button, #host-shell input, #host-shell select { background:yellow; border:8px solid red; padding:30px; font-size:30px; border-radius:40px; transform:rotate(3deg); line-height:2; }
#host-shell main { width:80%; max-width:500px; margin:40px; padding:40px; }
table { display:block; border-spacing:20px; background:yellow; }
th,td { padding:40px; font-size:28px; }
ul { display:flex; padding:35px; margin:30px; list-style:square; }
img { max-width:80px; width:80px; height:80px; display:inline; border:6px solid red; }
svg { width:80px; height:80px; fill:tomato; stroke:red; }
svg path { stroke:red; }
.button,.input,.icon,.title,.main,.table,.card,.sidebar { outline:12px solid orange !important; }
@keyframes l13 { to { transform:scale(4); } }
@keyframes slideIn { to { opacity:0; } }
`;
