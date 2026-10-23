import { demoCatalogs } from "./catalogs";
import { demoModels } from "./models";
import { demoParameters, demoCars } from "./parameters";
import { getDemoGroups } from "./groups";
import { demoParts } from "./parts";
import { demoOE, demoOEGroups, demoOEParts } from "./oe";
import { demoAnalogs, demoAnalogInfo, demoApplicability } from "./analogs";
import type { Parameter } from "../store/parameters/parameters.types";

interface MockResponse {
  data: unknown;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
}

const ok = (data: unknown): MockResponse => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
});

const notFound = (url: string): MockResponse => ({
  data: { detail: `No demo data for ${url}` },
  status: 404,
  statusText: "Not Found",
  headers: {},
  config: {},
});

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export async function demoRequest(
  method: string,
  url: string,
  data?: unknown,
): Promise<MockResponse> {
  await delay();

  const cleanUrl = url.split("?")[0];
  const params = new URL(url, "http://demo.local").searchParams;

  // GET /catalogs/
  if (method === "GET" && cleanUrl === "/catalogs/") {
    return ok(demoCatalogs);
  }

  // GET /catalogs/{catalogId}/models/
  const modelsMatch = cleanUrl.match(/^\/catalogs\/([^/]+)\/models\/?$/);
  if (method === "GET" && modelsMatch) {
    const catalogId = modelsMatch[1];
    return ok(demoModels[catalogId] ?? []);
  }

  // GET /catalogs/{catalogId}/cars-parameters/
  const paramsMatch = cleanUrl.match(/^\/catalogs\/([^/]+)\/cars-parameters\/?$/);
  if (method === "GET" && paramsMatch) {
    const modelId = params.get("modelId");
    if (!modelId) return notFound(url);
    const allParams = demoParameters[modelId] ?? [];
    const selected = params.getAll("parameter");
    if (selected.length === 0) {
      return ok(allParams);
    }
    // When a parameter is selected, filter remaining params
    const remaining = allParams.filter(
      (p) => !p.values.some((v) => selected.includes(v.idx)),
    );
    if (remaining.length === 0) {
      return ok([] as Parameter[]);
    }
    return ok(remaining);
  }

  // GET /catalogs/{catalogId}/cars2/
  const carsMatch = cleanUrl.match(/^\/catalogs\/([^/]+)\/cars2\/?$/);
  if (method === "GET" && carsMatch) {
    const modelId = params.get("modelId");
    if (!modelId) return notFound(url);
    const parameters = params.getAll("parameter");
    const cars = demoCars[modelId] ?? {};
    if (parameters.length === 0) {
      const all = Object.values(cars);
      return ok(all.length > 0 ? all : [{ id: modelId + "_car" }]);
    }
    const car = cars[parameters[parameters.length - 1]];
    return ok(car ? [car] : [{ id: modelId + "_car" }]);
  }

  // GET /catalogs/{catalogId}/groups2
  const groupsMatch = cleanUrl.match(/^\/catalogs\/([^/]+)\/groups2$/);
  if (method === "GET" && groupsMatch) {
    const groupId = params.get("groupId") ?? undefined;
    return ok(getDemoGroups(groupId));
  }

  // GET /catalogs/{catalogId}/parts2
  const partsMatch = cleanUrl.match(/^\/catalogs\/([^/]+)\/parts2$/);
  if (method === "GET" && partsMatch) {
    const groupId = params.get("groupId");
    if (!groupId) return notFound(url);
    return ok(demoParts[groupId] ?? { img: "", imgDescription: "", partGroups: [], positions: [] });
  }

  // GET /car/info
  if (method === "GET" && cleanUrl === "/car/info") {
    return ok([]);
  }

  // GET /car/vin-info
  if (method === "GET" && cleanUrl === "/car/vin-info") {
    return ok([
      {
        brand: "Volkswagen",
        carId: "vw_golf_14tsi_car",
        model: "Golf VII",
        vin: params.get("q") ?? "",
        parameters: [],
        optionCodes: null,
      },
    ]);
  }

  // GET /search/{catalogId}/ai
  const aiSearchMatch = cleanUrl.match(/^\/search\/([^/]+)\/ai$/);
  if (method === "GET" && aiSearchMatch) {
    return ok(getDemoGroups());
  }

  // GET /search/pb
  if (method === "GET" && cleanUrl === "/search/pb") {
    const query = params.get("query") ?? "";
    const oe = demoOE[query];
    return ok(oe ?? null);
  }

  // GET /search/pb/groups
  if (method === "GET" && cleanUrl === "/search/pb/groups") {
    const carId = params.get("carId") ?? "";
    return ok(demoOEGroups[carId] ?? []);
  }

  // GET /search/pb/parts
  if (method === "GET" && cleanUrl === "/search/pb/parts") {
    const groupId = params.get("groupId") ?? "";
    return ok(demoOEParts[groupId] ?? { img: "", imgDescription: "", partGroups: [], positions: [] });
  }

  // POST /crossdoc/getAnalogs
  if (method === "POST" && cleanUrl === "/crossdoc/getAnalogs") {
    const body = data as { searchQuery?: string };
    const query = body?.searchQuery ?? "";
    return ok(demoAnalogs[query] ?? []);
  }

  // POST /crossdoc/getAnalogInfo
  if (method === "POST" && cleanUrl === "/crossdoc/getAnalogInfo") {
    const body = data as { id?: number };
    const id = body?.id;
    if (id != null && demoAnalogInfo[id]) {
      return ok(demoAnalogInfo[id]);
    }
    return ok(null);
  }

  // POST /crossdoc/getApplicability
  if (method === "POST" && cleanUrl === "/crossdoc/getApplicability") {
    const body = data as { articleId?: number };
    const articleId = body?.articleId;
    if (articleId != null && demoApplicability[articleId]) {
      return ok(demoApplicability[articleId]);
    }
    return ok([]);
  }

  return notFound(url);
}
