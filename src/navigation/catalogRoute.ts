import type { Breadcrumb } from "../store/breadcrumbs/breadcrumbs.types";

export const NAV_PARAM = "catalogNav";
export const PATH_PARAM = "catalogPath";

export interface CatalogRoute {
  version: 1;
  opened: boolean;
  catalogId: string;
  brand: string;
  carId?: string;
  regionId?: string;
  breadcrumbs: Breadcrumb[];
}

const types = new Set([
  "model",
  "parameter",
  "group",
  "part",
  "vin",
  "oe",
  "oe-group",
  "search",
  "parts-search",
  "analogs",
  "analog-detail",
]);

export const emptyRoute = (opened = false): CatalogRoute => ({
  version: 1,
  opened,
  catalogId: "",
  brand: "",
  breadcrumbs: [],
});

export const getNavKey = (crumb: { type: string; id?: string }) =>
  `${crumb.type === "parts" ? "part" : crumb.type}:${crumb.id ?? ""}`;

export const routeKey = (route: CatalogRoute) =>
  JSON.stringify([route.opened, route.catalogId, route.breadcrumbs]);

export const routeNavKey = (route: CatalogRoute) => {
  const last = route.breadcrumbs.at(-1);
  return last
    ? getNavKey(last)
    : route.catalogId
      ? `brand:${route.catalogId}`
      : "brands:";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseRoute = (value: unknown): CatalogRoute | null => {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.opened !== "boolean" ||
    typeof value.catalogId !== "string" ||
    typeof value.brand !== "string" ||
    !Array.isArray(value.breadcrumbs) ||
    (value.carId !== undefined && typeof value.carId !== "string") ||
    (value.regionId !== undefined && typeof value.regionId !== "string")
  )
    return null;

  const breadcrumbs: Breadcrumb[] = [];
  for (const crumb of value.breadcrumbs) {
    if (
      !isRecord(crumb) ||
      typeof crumb.type !== "string" ||
      !types.has(crumb.type) ||
      typeof crumb.name !== "string" ||
      typeof crumb.id !== "string" ||
      !crumb.id
    )
      return null;
    breadcrumbs.push({ type: crumb.type, name: crumb.name, id: crumb.id });
  }
  return {
    version: 1,
    opened: value.opened,
    catalogId: value.catalogId,
    brand: value.brand,
    breadcrumbs,
    ...(value.carId ? { carId: value.carId } : {}),
    ...(value.regionId ? { regionId: value.regionId } : {}),
  };
};

export const readCatalogRoute = (href: string): CatalogRoute | null => {
  const params = new URL(href).searchParams;
  const nav = params.get(NAV_PARAM)?.replace(/^parts:/, "part:");
  const encodedPath = params.get(PATH_PARAM);
  if (encodedPath) {
    try {
      const route = parseRoute(JSON.parse(encodedPath));
      if (!route) return null;
      if (!nav || nav === routeNavKey(route)) return route;
      if (nav === "brands:") return emptyRoute(true);
      if (nav === `brand:${route.catalogId}`)
        return { ...route, breadcrumbs: [] };
      let index = -1;
      route.breadcrumbs.forEach((crumb, position) => {
        if (getNavKey(crumb) === nav) index = position;
      });
      return index < 0
        ? null
        : { ...route, breadcrumbs: route.breadcrumbs.slice(0, index + 1) };
    } catch {
      return null;
    }
  }
  if (!nav) return emptyRoute();
  const separator = nav.indexOf(":");
  if (separator < 0) return null;
  const type = nav.slice(0, separator);
  const id = nav.slice(separator + 1);
  if (type === "brands") return emptyRoute(true);
  if (!id) return null;
  if (type === "brand") return { ...emptyRoute(true), catalogId: id };
  if (!types.has(type)) return null;
  const catalogId = params.get("catalogId") ?? "";
  const carId = params.get("carId") ?? undefined;
  const modelId = params.get("modelId");
  if (["model", "parameter", "group", "part"].includes(type) && !catalogId)
    return null;
  if (["group", "part"].includes(type) && !carId && !modelId) return null;
  const breadcrumbs: Breadcrumb[] = [];
  if (modelId && type !== "model")
    breadcrumbs.push({ type: "model", id: modelId, name: modelId });
  for (const parameter of params.getAll("parameter")) {
    breadcrumbs.push({ type: "parameter", id: parameter, name: parameter });
  }
  breadcrumbs.push({ type, id, name: id });
  return { ...emptyRoute(true), catalogId, carId, breadcrumbs };
};

export const catalogRouteUrl = (href: string, route: CatalogRoute) => {
  const url = new URL(href);
  if (!route.opened) {
    url.searchParams.delete(NAV_PARAM);
    url.searchParams.delete(PATH_PARAM);
  } else {
    url.searchParams.set(NAV_PARAM, routeNavKey(route));
    url.searchParams.set(PATH_PARAM, JSON.stringify(route));
  }
  return url.toString();
};
