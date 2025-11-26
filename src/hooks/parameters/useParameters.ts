import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  fetchParameters,
  fetchCarId,
} from "../../store/parameters/parametersThunks";
import { fetchGroups } from "../../store/groups/groupsThunks";

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
      newParameter?: string | null
    ) => {
      const resultAction = await dispatch(
        fetchParameters({
          catalogId,
          modelId,
          selectedParameters,
          newParameter,
        })
      );

      if (fetchParameters.fulfilled.match(resultAction)) {
        const newParams = resultAction.payload.data;
        const oldCount = parameters.length;
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

              await dispatch(
                fetchGroups({
                  catalogId,
                  carId: actualCarId,
                })
              );
            }
          }
        }
      }
    },
    [dispatch, parameters.length, selectedParameters, carId]
  );

  return {
    parameters,
    parametersLoading,
    parametersError,
    carId,
    selectedParameters,
    getParameters,
  };
};
