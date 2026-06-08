import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  addBreadcrumb,
  trimBreadcrumbs,
  resetBreadcrumbs,
  navigateToBreadcrumb,
} from "../../store/breadcrumbs/breadcrumbsSlice";

export const useBreadcrumbs = () => {
  const dispatch = useAppDispatch();
  const { breadcrumbs, currentIndex } = useAppSelector(
    (state) => state.breadcrumbs
  );

  const handleAddBreadcrumb = useCallback(
    (type: string, name: string, id?: string) => {
      dispatch(addBreadcrumb({ type, name, id }));
    },
    [dispatch]
  );

  const handleTrimBreadcrumbs = useCallback(
    (index: number) => {
      dispatch(trimBreadcrumbs(index));
    },
    [dispatch]
  );

  const handleResetBreadcrumbs = useCallback(() => {
    dispatch(resetBreadcrumbs());
  }, [dispatch]);

  const handleNavigateToBreadcrumb = useCallback(
    (index: number) => {
      dispatch(navigateToBreadcrumb(index));
    },
    [dispatch]
  );

  return {
    breadcrumbs,
    currentIndex,
    handleAddBreadcrumb,
    handleTrimBreadcrumbs,
    handleResetBreadcrumbs,
    handleNavigateToBreadcrumb,
  };
};
