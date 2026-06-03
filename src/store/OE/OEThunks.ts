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
