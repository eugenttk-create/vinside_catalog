import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchOE = createAsyncThunk(
  "OE/fetchOE",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search/pb?query=${query}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch data"
      );
    }
  }
);

export const fetchOEGroups = createAsyncThunk(
  "OE/fetchOEGroups",
  async (carId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search/pb/groups?carId=${carId}`);
      return {
        parentId: null,
        children: response.data,
        flat: response.data,
      };
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

export const fetchOEParts = createAsyncThunk(
  "OE/fetchOEParts",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search/pb/parts?groupId=${groupId}`);
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
