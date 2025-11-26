import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (
    {
      catalogId,
      carId,
      groupId,
    }: { catalogId: string; carId: string; groupId?: string },
    { rejectWithValue }
  ) => {
    try {
      let url = `/catalogs/${catalogId}/groups2?carId=${carId}`;
      if (groupId) {
        url += `&groupId=${groupId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch groups"
      );
    }
  }
);
