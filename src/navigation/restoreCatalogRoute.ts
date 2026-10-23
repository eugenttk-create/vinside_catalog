import type { AppDispatch, RootState } from "../store/store";
import { replaceBreadcrumbs } from "../store/breadcrumbs/breadcrumbsSlice";
import {
  closeCatalog,
  openCatalog,
  resetModels,
  setCatalogId,
  setIsVinSearch,
  setSelectedBrand,
} from "../store/models/modelsSlice";
import { resetParameters, setCarId } from "../store/parameters/parametersSlice";
import {
  resetGroups,
  setAiSearchQuery,
  setIsAiSearch,
} from "../store/groups/groupsSlice";
import { resetParts } from "../store/parts/partsSlice";
import { resetOE, setIsOESearch } from "../store/OE/OESlice";
import { resetAnalogs, setSelectedAnalog } from "../store/analogs/analogsSlice";
import { fetchModels } from "../store/models/modelsThunks";
import { fetchCatalogs } from "../store/catalogs/catalogsThunks";
import {
  fetchCarId,
  fetchParameters,
} from "../store/parameters/parametersThunks";
import {
  fetchByVin,
  fetchGroups,
  fetchGroupsBySearchQuery,
  fetchVinInfo,
} from "../store/groups/groupsThunks";
import { fetchParts } from "../store/parts/partsThunks";
import { fetchOE, fetchOEGroups, fetchOEParts } from "../store/OE/OEThunks";
import { fetchAnalogs, fetchAnalogInfo } from "../store/analogs/analogsThunks";
import { isAllParamsResponse } from "../utils/parameters";
import type { CatalogRoute } from "./catalogRoute";

interface NavigationStore {
  dispatch: AppDispatch;
  getState: () => RootState;
}

export async function restoreCatalogRoute(
  store: NavigationStore,
  route: CatalogRoute,
  signal: AbortSignal,
) {
  const { dispatch, getState } = store;
  const request = async <T>(task: {
    abort: () => void;
    unwrap: () => Promise<T>;
  }) => {
    const abort = () => task.abort();
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    try {
      const result = await task.unwrap();
      signal.throwIfAborted();
      return result;
    } finally {
      signal.removeEventListener("abort", abort);
    }
  };

  signal.throwIfAborted();
  const existing = getState();
  const previousPath = existing.breadcrumbs.breadcrumbs.slice(
    0,
    existing.breadcrumbs.currentIndex + 1,
  );
  const target = route.breadcrumbs.at(-1);
  if (
    target?.type === "part" &&
    route.catalogId === existing.models.catalogId &&
    route.carId === existing.parameters.carId &&
    !existing.parts.partsLoading &&
    existing.parts.loadedGroupId === target.id &&
    !existing.parts.partsError &&
    existing.parts.parts.partGroups.length > 0 &&
    previousPath.length > route.breadcrumbs.length &&
    JSON.stringify(previousPath.slice(0, route.breadcrumbs.length)) ===
      JSON.stringify(route.breadcrumbs) &&
    previousPath
      .slice(route.breadcrumbs.length)
      .every((crumb) => ["analogs", "analog-detail"].includes(crumb.type))
  ) {
    dispatch(replaceBreadcrumbs(route.breadcrumbs));
    dispatch(resetAnalogs());
    return;
  }
  dispatch(replaceBreadcrumbs(route.breadcrumbs));
  dispatch(resetAnalogs());
  dispatch(resetParts());
  dispatch(resetGroups());
  dispatch(resetParameters());
  dispatch(resetOE());
  dispatch(resetModels());
  dispatch(setSelectedBrand(route.brand));
  dispatch(setIsVinSearch(false));
  dispatch(route.opened ? openCatalog() : closeCatalog());
  if (!route.opened) return;

  let catalogId = route.catalogId;
  let carId = route.carId;
  dispatch(setCatalogId(catalogId));
  const path = route.breadcrumbs;
  let rootIndex = -1;
  path.forEach((crumb, index) => {
    if (crumb.type === "vin" || crumb.type === "oe") rootIndex = index;
  });
  const root = path[rootIndex];
  const activePath = path.slice(rootIndex + 1);
  const model = activePath.find((crumb) => crumb.type === "model");

  if (root?.type === "oe") {
    dispatch(setIsOESearch(true));
    await request(dispatch(fetchOE(root.id!)));
    const oeGroup = activePath.find((crumb) => crumb.type === "oe-group");
    if (oeGroup) {
      carId = oeGroup.id;
      dispatch(setCarId(carId));
      await request(dispatch(fetchOEGroups(carId!)));
    }
  } else if (root?.type === "vin") {
    dispatch(setIsVinSearch(true));
    if (catalogId && carId) {
      dispatch(setCarId(carId));
      await request(
        dispatch(fetchVinInfo({ vin: root.id!, regionId: route.regionId })),
      );
      await request(dispatch(fetchGroups({ catalogId, carId })));
    } else {
      const result = await request(
        dispatch(fetchByVin({ vin: root.id!, regionId: route.regionId })),
      );
      if (result.type !== "car") return;
      catalogId = result.carData.catalogId;
      carId = result.carData.carId;
    }
  } else if (catalogId) {
    if (!route.brand) {
      if (getState().catalogs.catalogs.length === 0)
        await request(dispatch(fetchCatalogs()));
      dispatch(
        setSelectedBrand(
          getState().catalogs.catalogs.find(
            (catalog) => catalog.id === catalogId,
          )?.name ?? catalogId,
        ),
      );
    }
    await request(dispatch(fetchModels(catalogId)));
    if (model) {
      const selections = activePath
        .filter((crumb) => crumb.type === "parameter")
        .map((crumb) => crumb.id!);
      let response = await request(
        dispatch(
          fetchParameters({
            catalogId,
            modelId: model.id!,
            selectedParameters: [],
          }),
        ),
      );
      let previousCount = response.data.length;
      const allParams = isAllParamsResponse(response.data);
      const totalCount = response.data.length;
      let complete = totalCount === 0;
      for (let index = 0; index < selections.length; index++) {
        response = await request(
          dispatch(
            fetchParameters({
              catalogId,
              modelId: model.id!,
              selectedParameters: selections.slice(0, index),
              newParameter: selections[index],
            }),
          ),
        );
        complete = allParams
          ? index + 1 >= totalCount
          : response.data.length === previousCount ||
            response.data.length === 0;
        previousCount = response.data.length;
      }
      const needsGroups =
        complete ||
        activePath.some((crumb) =>
          ["group", "part", "search", "parts-search"].includes(crumb.type),
        );
      if (needsGroups) {
        carId =
          carId ??
          (await request(
            dispatch(
              fetchCarId({
                catalogId,
                modelId: model.id!,
                parameters: selections,
              }),
            ),
          ));
        dispatch(setCarId(carId));
        await request(dispatch(fetchGroups({ catalogId, carId: carId! })));
      }
    } else if (carId) {
      dispatch(setCarId(carId));
      await request(dispatch(fetchGroups({ catalogId, carId })));
    }
  }

  for (const crumb of activePath) {
    if (crumb.type === "search" || crumb.type === "parts-search") {
      dispatch(setAiSearchQuery(crumb.id!));
      dispatch(setIsAiSearch(true));
      await request(
        dispatch(
          fetchGroupsBySearchQuery({ catalogId, carId: carId!, q: crumb.id! }),
        ),
      );
    }
    if (crumb.type === "group") {
      await request(
        dispatch(fetchGroups({ catalogId, carId: carId!, groupId: crumb.id })),
      );
    }
    if (crumb.type === "part") {
      if (root?.type === "oe") {
        await request(dispatch(fetchOEParts(crumb.id!)));
      } else {
        await request(
          dispatch(
            fetchParts({
              catalogId,
              carId: carId!,
              groupId: crumb.id!,
              searchQuery: getState().groups.aiSearchQuery || undefined,
            }),
          ),
        );
      }
    }
  }

  const analogCrumb = activePath
    .slice()
    .reverse()
    .find((crumb) => crumb.type === "analogs");
  if (target?.type === "analogs" || target?.type === "analog-detail") {
    if (!analogCrumb) throw new Error("Missing analog search context");
    const result = await request(dispatch(fetchAnalogs(analogCrumb.id!)));
    if (target.type === "analog-detail") {
      const analog = result.analogs.find(
        (item) => String(item.id) === target.id,
      );
      if (!analog) throw new Error("Analog not found");
      dispatch(setSelectedAnalog(analog));
      await request(
        dispatch(
          fetchAnalogInfo({
            id: analog.id,
            articleNumber: analog.articleNumber,
            genericArticleIds: analog.genericArticleIds,
          }),
        ),
      );
    }
  }
}
