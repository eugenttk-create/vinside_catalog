import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchModels } from "../../store/models/modelsThunks";
import { setCatalogId } from "../../store/models/modelsSlice";

export const useModels = () => {
  const dispatch = useAppDispatch();
  const { models, modelsLoading, modelsError, catalogId } = useAppSelector(
    (state) => state.models
  );

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

  return {
    models,
    modelsLoading,
    modelsError,
    getModels,
    setCatalogId: setCatalogIdDispatch,
    catalogId,
  };
};
