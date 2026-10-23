import { isPending, type Middleware } from "@reduxjs/toolkit";

interface CatalogRequest extends Promise<unknown> {
  abort: () => void;
  requestId: string;
}

const pending = new Set<CatalogRequest>();
const catalogLists = new Set<string>();

const isCatalogRequest = (value: unknown): value is CatalogRequest =>
  value instanceof Promise &&
  "abort" in value &&
  typeof value.abort === "function" &&
  "requestId" in value &&
  typeof value.requestId === "string";

export const catalogRequestMiddleware: Middleware =
  () => (next) => (action) => {
    if (isPending(action) && action.type === "catalogs/fetchCatalogs/pending") {
      catalogLists.add(action.meta.requestId);
    }
    const result = next(action);
    if (typeof action === "function" && isCatalogRequest(result)) {
      if (!catalogLists.has(result.requestId)) pending.add(result);
      void result.then(() => {
        pending.delete(result);
        catalogLists.delete(result.requestId);
      });
    }
    return result;
  };

export const cancelCatalogRequests = async () => {
  const requests = [...pending];
  requests.forEach((request) => request.abort());
  await Promise.all(requests);
};
