import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  fetchGroups,
  fetchByVin,
  fetchVinInfo,
  fetchGroupsBySearchQuery,
} from "../../store/groups/groupsThunks";
import {
  resetGroups,
  setIsAiSearch as isSearch,
  setAiSearchQuery as setSearch,
} from "../../store/groups/groupsSlice";

export const useGroups = () => {
  const dispatch = useAppDispatch();

  const {
    groupsTree,
    groupsFlat,
    groupsLoading,
    groupsError,
    selectedGroups,
    isSidebarLoading,
    vinInfo,
    isAiSearch,
    aiSearchQuery,
    searchResultType,
  } = useAppSelector((s) => s.groups);

  const getGroups = useCallback(
    (catalogId: string, carId: string, groupId?: string) => {
      return dispatch(fetchGroups({ catalogId, carId, groupId }));
    },
    [dispatch]
  );

  const getGroupsByVin = useCallback(
    (vin: string) => {
      return dispatch(fetchByVin(vin)).unwrap();
    },
    [dispatch]
  );

  const handleResetGroups = useCallback(() => {
    return dispatch(resetGroups());
  }, [dispatch]);

  const getVinInfo = useCallback(
    (vin: string) => {
      if (vinInfo) return vinInfo;
      return dispatch(fetchVinInfo(vin));
    },
    [dispatch]
  );

  const searchGroups = useCallback(
    (catalogId: string, carId: string, q: string) => {
      return dispatch(fetchGroupsBySearchQuery({ catalogId, carId, q }));
    },
    [dispatch]
  );

  const setIsAiSearch = useCallback(
    (arg: boolean) => {
      return dispatch(isSearch(arg));
    },
    [dispatch]
  );

  const setAiSearchQuery = useCallback(
    (query: string) => {
      return dispatch(setSearch(query));
    },
    [dispatch]
  );

  return {
    groupsTree,
    groupsFlat,
    groupsLoading,
    groupsError,
    getGroups,
    selectedGroups,
    getGroupsByVin,
    handleResetGroups,
    getVinInfo,
    searchGroups,
    isSidebarLoading,
    vinInfo,
    setIsAiSearch,
    isAiSearch,
    aiSearchQuery,
    setAiSearchQuery,
    searchResultType,
  };
};
