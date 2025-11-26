import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchModels = createAsyncThunk(
  "models/fetchModels",
  async (catalogId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/catalogs/${catalogId}/models/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch models"
      );
    }
  }
);
