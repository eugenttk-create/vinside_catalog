import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchParameters = createAsyncThunk(
  "parameters/fetchParameters",
  async (
    { catalogId, modelId }: { catalogId: string; modelId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/catalogs/${catalogId}/cars-parameters/?modelId=${modelId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch parameters"
      );
    }
  }
);
