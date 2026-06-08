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

export const useParameters = () => {
  const dispatch = useAppDispatch();
  const {
    parameters,
    parametersLoading,
    parametersError,
    selectedParameters,
    carId,
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

      if (fetchParameters.fulfilled.match(resultAction)) {
        const newParams = resultAction.payload.data;
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
            fetchCarId({
              catalogId,
              modelId,
              parameters: [],
            })
          );

          if (fetchCarId.fulfilled.match(carIdAction)) {
            const actualCarId = carIdAction.payload;
            await dispatch(fetchGroups({ catalogId, carId: actualCarId }));
          }
        }
      }
    },
    [dispatch, parameters.length, selectedParameters, carId]
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
    getParameters,
    handleResetParameters,
    handleResetCarId,
    handleSetCarId,
  };
};
