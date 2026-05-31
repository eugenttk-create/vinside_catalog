import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchParts } from "../../store/parts/partsThunks";
import { resetParts } from "../../store/parts/partsSlice";

export const useParts = () => {
  const dispatch = useAppDispatch();
  const { parts, partsLoading, partsError } = useAppSelector(
    (state) => state.parts
  );

  const getParts = useCallback(
    (
      catalogId: string,
      carId: string,
      groupId: string,
      searchQuery?: string
    ) => {
      return dispatch(fetchParts({ catalogId, carId, groupId, searchQuery }));
    },
    [dispatch]
  );

  const handleResetParts = useCallback(() => {
    return dispatch(resetParts());
  }, [dispatch]);

  return {
    parts,
    partsLoading,
    partsError,
    getParts,
    handleResetParts,
  };
};
