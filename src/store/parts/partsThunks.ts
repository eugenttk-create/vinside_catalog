import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchParts = createAsyncThunk(
  "parts/fetchParts",
  async (
    {
      catalogId,
      carId,
      groupId,
      searchQuery,
    }: {
      catalogId: string;
      carId: string;
      groupId: string;
      searchQuery?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/catalogs/${catalogId}/parts2?carId=${carId}&groupId=${groupId}${
          searchQuery ? `&query=${searchQuery}` : ""
        }`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch parts"
      );
    }
  }
);
