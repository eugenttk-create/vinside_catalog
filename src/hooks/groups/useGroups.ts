import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchGroups, fetchByVin } from "../../store/groups/groupsThunks";
import { addSelectedGroup } from "../../store/groups/groupsSlice";

export const useGroups = () => {
  const dispatch = useAppDispatch();

  const { groupsTree, groupsFlat, groupsLoading, groupsError, selectedGroups } =
    useAppSelector((s) => s.groups);

  const getGroups = useCallback(
    (catalogId: string, carId: string, groupId?: string) => {
      return dispatch(fetchGroups({ catalogId, carId, groupId }));
    },
    [dispatch]
  );

  const getGroupsByVin = useCallback(
    (vin: string) => {
      return dispatch(fetchByVin(vin));
    },
    [dispatch]
  );

  const selectGroup = useCallback(
    (name: string) => dispatch(addSelectedGroup(name)),
    [dispatch]
  );

  return {
    groupsTree,
    groupsFlat,
    groupsLoading,
    groupsError,
    getGroups,
    selectGroup,
    selectedGroups,
    getGroupsByVin,
  };
};
