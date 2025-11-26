import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchParameters } from "../../store/parameters/parametersThunks";

export const useParameters = () => {
  const dispatch = useAppDispatch();
  const { parameters, parametersLoading, parametersError } = useAppSelector(
    (state) => state.parameters
  );

  const getParameters = useCallback(
    (catalogId: string, modelId: string) => {
      return dispatch(
        fetchParameters({ catalogId: catalogId, modelId: modelId })
      );
    },
    [dispatch]
  );

  return {
    parameters,
    parametersLoading,
    parametersError,
    getParameters,
  };
};
