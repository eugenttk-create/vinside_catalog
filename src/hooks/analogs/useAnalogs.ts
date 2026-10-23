import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import {
  resetAnalogs,
  setIsAnalogsView,
  setSelectedAnalog,
  setSelectedBrandId,
  clearAnalogDetail,
} from "../../store/analogs/analogsSlice";
import {
  fetchAnalogs,
  fetchAnalogInfo,
  fetchApplicability,
} from "../../store/analogs/analogsThunks";
import type { Analog } from "../../store/analogs/analogs.types";

export const useAnalogs = () => {
  const dispatch = useAppDispatch();
  const {
    analogs,
    analogsLoading,
    analogsError,
    searchQuery,
    selectedAnalog,
    analogInfo,
    analogInfoLoading,
    analogInfoError,
    applicability,
    applicabilityLoading,
    applicabilityError,
    selectedBrandId,
    isAnalogsView,
    isAnalogDetailView,
  } = useAppSelector((state) => state.analogs);

  const getAnalogs = useCallback(
    (query: string) => {
      return dispatch(fetchAnalogs(query));
    },
    [dispatch],
  );

  const getAnalogInfo = useCallback(
    (analog: Analog) => {
      dispatch(setSelectedAnalog(analog));
      return dispatch(
        fetchAnalogInfo({
          id: analog.id,
          articleNumber: analog.articleNumber,
          genericArticleIds: analog.genericArticleIds,
        }),
      );
    },
    [dispatch],
  );

  const getApplicability = useCallback(
    (articleId: number, brandId: number) => {
      return dispatch(fetchApplicability({ articleId, brandId }));
    },
    [dispatch],
  );

  const handleResetAnalogs = useCallback(() => {
    return dispatch(resetAnalogs());
  }, [dispatch]);

  const handleSetIsAnalogsView = useCallback(
    (val: boolean) => {
      return dispatch(setIsAnalogsView(val));
    },
    [dispatch],
  );

  const handleSetSelectedAnalog = useCallback(
    (analog: Analog | null) => {
      return dispatch(setSelectedAnalog(analog));
    },
    [dispatch],
  );

  const handleSetSelectedBrandId = useCallback(
    (brandId: number | null) => {
      return dispatch(setSelectedBrandId(brandId));
    },
    [dispatch],
  );

  const handleClearAnalogDetail = useCallback(() => {
    return dispatch(clearAnalogDetail());
  }, [dispatch]);

  return {
    analogs,
    analogsLoading,
    analogsError,
    searchQuery,
    selectedAnalog,
    analogInfo,
    analogInfoLoading,
    analogInfoError,
    applicability,
    applicabilityLoading,
    applicabilityError,
    selectedBrandId,
    isAnalogsView,
    isAnalogDetailView,
    getAnalogs,
    getAnalogInfo,
    getApplicability,
    handleResetAnalogs,
    handleSetIsAnalogsView,
    handleSetSelectedAnalog,
    handleSetSelectedBrandId,
    handleClearAnalogDetail,
  };
};
