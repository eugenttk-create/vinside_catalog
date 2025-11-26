import { useCallback } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useAppSelector } from "../store/useAppSelector";
import { fetchCatalogs } from "../../store/catalogs/catalogsThunks";

export const useCatalogs = () => {
  const dispatch = useAppDispatch();
  const { catalogs, catalogsLoading, catalogsError } = useAppSelector(
    (state) => state.catalogs
  );

  const getCatalogs = useCallback(() => {
    return dispatch(fetchCatalogs());
  }, [dispatch]);

  return {
    catalogs,
    catalogsLoading,
    catalogsError,
    getCatalogs,
  };
};
