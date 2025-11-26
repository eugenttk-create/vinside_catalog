import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchCatalogs = createAsyncThunk(
  "catalogs/fetchCatalogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/catalogs/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch catalogs"
      );
    }
  }
);
