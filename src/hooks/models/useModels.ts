import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchModels } from "../../store/models/modelsThunks";

export const useModels = () => {
  const dispatch = useAppDispatch();
  const { models, modelsLoading, modelsError } = useAppSelector(
    (state) => state.models
  );

  const getModels = useCallback(
    (catalogId: string) => {
      return dispatch(fetchModels(catalogId));
    },
    [dispatch]
  );

  return {
    models,
    modelsLoading,
    modelsError,
    getModels,
  };
};
