import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Analog } from "./analogs.types";

export const fetchAnalogs = createAsyncThunk(
  "analogs/fetchAnalogs",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/crossdoc/getAnalogs", {
        searchQuery,
      });
      return { analogs: response.data as Analog[], searchQuery };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch analogs"
      );
    }
  }
);

export const fetchAnalogInfo = createAsyncThunk(
  "analogs/fetchAnalogInfo",
  async (
    payload: {
      id: number;
      articleNumber: string;
      genericArticleIds: number[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/crossdoc/getAnalogInfo", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch analog info"
      );
    }
  }
);

export const fetchApplicability = createAsyncThunk(
  "analogs/fetchApplicability",
  async (
    payload: { articleId: number; brandId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/crossdoc/getApplicability", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch applicability"
      );
    }
  }
);
