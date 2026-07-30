import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  addBreadcrumb,
  trimBreadcrumbs,
  resetBreadcrumbs,
  navigateToBreadcrumb,
} from "../../store/breadcrumbs/breadcrumbsSlice";

export const NAV_PARAM = "catalogNav";

export const getNavKey = (b: { type: string; id?: string }) =>
  `${b.type}:${b.id ?? ""}`;

let suppressNextPopstate = false;

export const consumeSuppressFlag = () => {
  if (suppressNextPopstate) {
    suppressNextPopstate = false;
    return true;
  }
  return false;
};

export const pushNavEntry = (
  crumb: { type: string; id?: string },
  depth: number
) => {
  const url = new URL(window.location.href);
  url.searchParams.set(NAV_PARAM, getNavKey(crumb));
  window.history.pushState(
    { ...window.history.state, catalogDepth: depth },
    "",
    url.toString()
  );
};

export const clearNavState = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete(NAV_PARAM);
  window.history.pushState(
    { ...window.history.state, catalogDepth: undefined },
    "",
    url.toString()
  );
};

const getCurrentDepth = () =>
  (window.history.state?.catalogDepth as number | undefined) ?? 0;

export const goBackToDepth = (targetDepth: number) => {
  const delta = targetDepth - getCurrentDepth();
  if (delta >= 0) return;
  suppressNextPopstate = true;
  window.history.go(delta);
};

const depthForIndex = (index: number) => index + 1;

export const useBreadcrumbs = () => {
  const dispatch = useAppDispatch();
  const { breadcrumbs, currentIndex } = useAppSelector(
    (state) => state.breadcrumbs
  );

  const handleAddBreadcrumb = useCallback(
    (type: string, name: string, id?: string) => {
      dispatch(addBreadcrumb({ type, name, id }));
      pushNavEntry({ type, id }, depthForIndex(currentIndex + 1));
    },
    [dispatch, currentIndex]
  );

  const handleTrimBreadcrumbs = useCallback(
    (index: number) => {
      goBackToDepth(depthForIndex(index));
      dispatch(trimBreadcrumbs(index));
    },
    [dispatch]
  );

  const handleResetBreadcrumbs = useCallback(() => {
    dispatch(resetBreadcrumbs());
    clearNavState();
  }, [dispatch]);

  const handleResetBreadcrumbsSilently = useCallback(() => {
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
    handleResetBreadcrumbsSilently,
    handleNavigateToBreadcrumb,
  };
};
