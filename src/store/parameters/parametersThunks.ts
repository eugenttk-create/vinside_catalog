import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchParameters = createAsyncThunk(
  "parameters/fetchParameters",
  async (
    {
      catalogId,
      modelId,
      selectedParameters,
      newParameter,
    }: {
      catalogId: string;
      modelId: string;
      selectedParameters: string[];
      newParameter?: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      params.append("modelId", modelId);

      selectedParameters.forEach((p) => params.append("parameter", p));

      if (newParameter) params.append("parameter", newParameter);

      const response = await api.get(
        `/catalogs/${catalogId}/cars-parameters/?${params.toString()}`
      );

      return {
        data: response.data,
        appendedParameter: newParameter || null,
      };
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

export const fetchCarId = createAsyncThunk(
  "parameters/fetchCarId",
  async (
    {
      catalogId,
      modelId,
      parameters,
    }: { catalogId: string; modelId: string; parameters: string[] },
    { rejectWithValue }
  ) => {
    try {
      const paramsQuery = parameters
        .map((p) => `parameter=${encodeURIComponent(p)}`)
        .join("&");

      const url = `/catalogs/${catalogId}/cars2/?modelId=${encodeURIComponent(
        modelId
      )}&${paramsQuery}`;
      const response = await api.get(url);

      const cars = response.data;
      if (!Array.isArray(cars) || cars.length === 0) {
        throw new Error("No car found");
      }

      return cars[0].id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch carId"
      );
    }
  }
);
