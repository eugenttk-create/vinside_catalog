import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { resetOE, setIsOESearch as setOESearch } from "../../store/OE/OESlice";
import { fetchOE, fetchOEGroups, fetchOEParts } from "../../store/OE/OEThunks";

export const useOE = () => {
  const dispatch = useAppDispatch();
  const { OE, OEError, OELoading, OEGroupsError, OEGroupsLoading, isOESearch } =
    useAppSelector((state) => state.OE);

  const getOE = useCallback(
    (OE: string) => {
      return dispatch(fetchOE(OE));
    },
    [dispatch]
  );

  const getOEGroups = useCallback(
    (carId: string) => {
      return dispatch(fetchOEGroups(carId));
    },
    [dispatch]
  );

  const getOEParts = useCallback(
    (groupId: string) => {
      return dispatch(fetchOEParts(groupId));
    },
    [dispatch]
  );

  const handleResetOE = useCallback(() => {
    return dispatch(resetOE());
  }, [dispatch]);

  const setIsOESearch = useCallback(
    (val: boolean) => {
      return dispatch(setOESearch(val));
    },
    [dispatch]
  );

  return {
    OE,
    OEError,
    OELoading,
    OEGroupsError,
    OEGroupsLoading,
    handleResetOE,
    setIsOESearch,
    isOESearch,
    getOE,
    getOEGroups,
    getOEParts,
  };
};
