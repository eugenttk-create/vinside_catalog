import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  addBreadcrumb,
  trimBreadcrumbs,
  resetBreadcrumbs,
} from "../../store/breadcrumbs/breadcrumbsSlice";

export const useBreadcrumbs = () => {
  const dispatch = useAppDispatch();
  const { breadcrumbs } = useAppSelector((state) => state.breadcrumbs);

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

  return {
    breadcrumbs,
    handleAddBreadcrumb,
    handleTrimBreadcrumbs,
    handleResetBreadcrumbs,
  };
};
