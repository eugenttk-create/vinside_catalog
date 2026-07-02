import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  fetchParameters,
  fetchCarId,
} from "../../store/parameters/parametersThunks";
import { fetchGroups } from "../../store/groups/groupsThunks";
import {
  resetParameters,
  resetCarId,
  setCarId,
} from "../../store/parameters/parametersSlice";
import { isAllParamsResponse } from "../../utils/parameters";

export const useParameters = () => {
  const dispatch = useAppDispatch();
  const {
    parameters,
    parametersLoading,
    parametersError,
    selectedParameters,
    carId,
    isAllParamsMode,
    totalParamsCount,
  } = useAppSelector((state) => state.parameters);

  const getParameters = useCallback(
    async (
      catalogId: string,
      modelId: string,
      newParameter?: string | null,
      forcedSelected?: string[] | null
    ) => {
      const paramsToUse = forcedSelected ?? selectedParameters;

      const resultAction = await dispatch(
        fetchParameters({
          catalogId,
          modelId,
          selectedParameters: paramsToUse,
          newParameter,
        })
      );

      if (!fetchParameters.fulfilled.match(resultAction)) return;

      const newParams = resultAction.payload.data;

      if (isAllParamsResponse(newParams)) {
        const totalCount = isAllParamsMode
          ? totalParamsCount
          : newParams.length;
        const selectedCount = paramsToUse.length + (newParameter ? 1 : 0);

        if (totalCount > 0 && selectedCount >= totalCount && !carId) {
          const allSelected = newParameter
            ? [...paramsToUse, newParameter]
            : paramsToUse;

          const carIdAction = await dispatch(
            fetchCarId({ catalogId, modelId, parameters: allSelected })
          );

          if (fetchCarId.fulfilled.match(carIdAction)) {
            const actualCarId = carIdAction.payload;
            await dispatch(fetchGroups({ catalogId, carId: actualCarId }));
          }
        }
        return;
      }

      const oldCount = forcedSelected ? 0 : parameters.length;
      const newCount = newParams.length;

      if (newCount === oldCount && newCount > 0) {
        if (!carId) {
          const carIdAction = await dispatch(
            fetchCarId({
              catalogId,
              modelId,
              parameters: newParameter
                ? [...selectedParameters, newParameter]
                : selectedParameters,
            })
          );

          if (fetchCarId.fulfilled.match(carIdAction)) {
            const actualCarId = carIdAction.payload;
            await dispatch(fetchGroups({ catalogId, carId: actualCarId }));
          }
        }
      }

      if (newCount === 0 && paramsToUse.length === 0 && !newParameter) {
        const carIdAction = await dispatch(
          fetchCarId({ catalogId, modelId, parameters: [] })
        );

        if (fetchCarId.fulfilled.match(carIdAction)) {
          const actualCarId = carIdAction.payload;
          await dispatch(fetchGroups({ catalogId, carId: actualCarId }));
        }
      }
    },
    [
      dispatch,
      parameters.length,
      selectedParameters,
      carId,
      isAllParamsMode,
      totalParamsCount,
    ]
  );

  const handleResetParameters = useCallback(() => {
    return dispatch(resetParameters());
  }, [dispatch]);

  const handleResetCarId = useCallback(() => {
    return dispatch(resetCarId());
  }, [dispatch]);

  const handleSetCarId = useCallback(
    (carId: string) => {
      return dispatch(setCarId(carId));
    },
    [dispatch]
  );

  return {
    parameters,
    parametersLoading,
    parametersError,
    carId,
    selectedParameters,
    isAllParamsMode,
    getParameters,
    handleResetParameters,
    handleResetCarId,
    handleSetCarId,
  };
};
