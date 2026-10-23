import store from "../store/store";
import type { RootState } from "../store/store";
import { addNotification } from "../store/notifications/notificationsSlice";
import { catalogRouteUrl, emptyRoute, readCatalogRoute, routeKey, type CatalogRoute } from "./catalogRoute";
import { restoreCatalogRoute } from "./restoreCatalogRoute";
import { cancelCatalogRequests } from "./catalogRequests";

export const routeFromState = (state: RootState): CatalogRoute => {
  if (!state.models.catalogOpened) return emptyRoute();
  const breadcrumbs = state.breadcrumbs.breadcrumbs.slice(0, state.breadcrumbs.currentIndex + 1);
  const usesCar = breadcrumbs.some((crumb) => ["group", "part", "vin", "oe-group", "search", "parts-search"].includes(crumb.type));
  return {
    version: 1, opened: true, catalogId: state.models.catalogId,
    brand: state.models.selectedBrand ?? "", breadcrumbs,
    ...(usesCar && state.parameters.carId ? { carId: state.parameters.carId } : {}),
    ...(breadcrumbs.some((crumb) => crumb.type === "vin") && state.groups.vinRegionId ? { regionId: state.groups.vinRegionId } : {}),
  };
};

const writeRoute = (route: CatalogRoute, replace: boolean) => {
  const url = catalogRouteUrl(window.location.href, route);
  // Keep the embedding site's history data and all unrelated URL parameters.
  const state = { ...window.history.state, carcatNavigation: route };
  window.history[replace ? "replaceState" : "pushState"](state, "", url);
};

let navigate: ((route: CatalogRoute) => Promise<void>) | undefined;

export const navigateToCatalogRoute = (route: CatalogRoute) => navigate?.(route);

export const navigateToCatalogBreadcrumb = (index: number) => {
  const route = routeFromState(store.getState());
  if (index < -1 || index >= route.breadcrumbs.length) return;
  return navigateToCatalogRoute({ ...route, breadcrumbs: route.breadcrumbs.slice(0, index + 1) });
};

// Mounted by App, so history keeps working while the catalog is closed and
// when the two existing breadcrumb render locations mount/unmount.
export function startCatalogNavigation(setModelId: (id: string) => void) {
  let disposed = false;
  let restoring = false;
  let scheduled = false;
  let controller: AbortController | undefined;
  let previous = routeFromState(store.getState());

  const restore = async (route: CatalogRoute, push: boolean) => {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    restoring = true;
    if (push) writeRoute(route, false);
    setModelId(route.breadcrumbs.find((crumb) => crumb.type === "model")?.id ?? "");
    try {
      await cancelCatalogRequests();
      current.signal.throwIfAborted();
      await restoreCatalogRoute(store, route, current.signal);
    } catch (error) {
      if (!current.signal.aborted) {
        store.dispatch(addNotification({
          message: typeof error === "string" ? error : error instanceof Error ? error.message : "Failed to restore catalog page",
          type: "error",
        }));
      }
    } finally {
      if (!disposed && controller === current) {
        restoring = false;
        previous = routeFromState(store.getState());
        // Resolve labels/car IDs without adding another browser history entry.
        writeRoute(previous, true);
      }
    }
  };

  navigate = (route) => restore(route, true);
  const unsubscribe = store.subscribe(() => {
    if (restoring || scheduled) return;
    scheduled = true;
    // A single user action often dispatches several synchronous Redux updates.
    // Commit their final path once instead of recording intermediate resets.
    queueMicrotask(() => {
      scheduled = false;
      if (disposed || restoring) return;
      const route = routeFromState(store.getState());
      if (JSON.stringify(route) === JSON.stringify(previous)) return;
      writeRoute(route, routeKey(route) === routeKey(previous));
      previous = route;
    });
  });

  const onPopState = () => {
    const route = readCatalogRoute(window.location.href);
    if (!route) return;
    if (!restoring && JSON.stringify(route) === JSON.stringify(previous)) return;
    void restore(route, false);
  };
  window.addEventListener("popstate", onPopState);
  const initial = readCatalogRoute(window.location.href);
  if (initial?.opened) void restore(initial, false);
  else if (initial) writeRoute(previous, true);

  return () => {
    disposed = true;
    controller?.abort();
    navigate = undefined;
    unsubscribe();
    window.removeEventListener("popstate", onPopState);
  };
}
