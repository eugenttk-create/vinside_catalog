import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchModels } from "../../store/models/modelsThunks";
import { setCatalogId } from "../../store/models/modelsSlice";
import {
  resetModels,
  openCatalog,
  closeCatalog,
  setSelectedBrand,
  setIsVinSearch,
} from "../../store/models/modelsSlice";

export const useModels = () => {
  const dispatch = useAppDispatch();
  const {
    models,
    modelsLoading,
    modelsError,
    catalogId,
    catalogOpened,
    selectedBrand,
    isVinSearch,
  } = useAppSelector((state) => state.models);

  const getModels = useCallback(
    (catalogId: string) => {
      return dispatch(fetchModels(catalogId));
    },
    [dispatch]
  );

  const setCatalogIdDispatch = useCallback(
    (id: string) => dispatch(setCatalogId(id)),
    [dispatch]
  );

  const handleResetModels = useCallback(() => {
    return dispatch(resetModels());
  }, [dispatch]);

  const handleOpenCatalog = useCallback(() => {
    return dispatch(openCatalog());
  }, [dispatch]);

  const handleCloseCatalog = useCallback(() => {
    return dispatch(closeCatalog());
  }, [dispatch]);

  const handleSetSelectedBrand = useCallback(
    (name: string) => {
      return dispatch(setSelectedBrand(name));
    },
    [dispatch]
  );

  const handleSetIsVinSearch = useCallback(
    (value: boolean) => {
      return dispatch(setIsVinSearch(value));
    },
    [dispatch]
  );

  return {
    models,
    modelsLoading,
    modelsError,
    getModels,
    setCatalogId: setCatalogIdDispatch,
    catalogId,
    handleResetModels,
    handleOpenCatalog,
    handleCloseCatalog,
    catalogOpened,
    handleSetSelectedBrand,
    selectedBrand,
    handleSetIsVinSearch,
    isVinSearch,
  };
};
