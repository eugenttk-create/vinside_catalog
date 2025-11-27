import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchGroups } from "../../store/groups/groupsThunks";
import { addSelectedGroup } from "../../store/groups/groupsSlice";

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { groups, groupsLoading, groupsError, selectedGroups } = useAppSelector(
    (state) => state.groups
  );

  const getGroups = useCallback(
    (catalogId: string, carId: string, groupId?: string) => {
      return dispatch(fetchGroups({ catalogId, carId, groupId }));
    },
    [dispatch]
  );

  const selectGroup = useCallback(
    (name: string) => {
      return dispatch(addSelectedGroup(name));
    },
    [dispatch]
  );

  return {
    groups,
    groupsLoading,
    groupsError,
    getGroups,
    selectGroup,
    selectedGroups,
  };
};
