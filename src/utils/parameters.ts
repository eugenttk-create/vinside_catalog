import type { Parameter } from "../store/parameters/parameters.types";

const PL_PREFIX = "pl_";

export const isAllParamsResponse = (params: Parameter[]): boolean => {
  const firstIdx = params[0]?.values?.[0]?.idx;
  return !!firstIdx && !firstIdx.startsWith(PL_PREFIX);
};
