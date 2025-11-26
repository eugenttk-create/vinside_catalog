import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchGroups } from "../../store/groups/groupsThunks";

export const useGroups = () => {
  const dispatch = useAppDispatch();
  const { groups, groupsLoading, groupsError } = useAppSelector(
    (state) => state.groups
  );

  const getGroups = useCallback(
    (catalogId: string, carId: string, groupId?: string) => {
      return dispatch(fetchGroups({ catalogId, carId, groupId }));
    },
    [dispatch]
  );

  return {
    groups,
    groupsLoading,
    groupsError,
    getGroups,
  };
};
