import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { setCatalogId } from "../models/modelsSlice";

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (
    {
      catalogId,
      carId,
      groupId,
    }: {
      catalogId: string;
      carId: string;
      groupId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      let url = `/catalogs/${catalogId}/groups2?carId=${carId}`;
      if (groupId) url += `&groupId=${groupId}`;
      const res = await api.get(url);
      return {
        parentId: groupId ?? null,
        children: res.data,
        flat: res.data,
      };
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.detail ?? "Failed to fetch groups"
      );
    }
  }
);

export const fetchByVin = createAsyncThunk(
  "groups/fetchByVin",
  async (vin: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/car/info?q=${vin}`);
      const carData = response.data[0];

      if (!carData) {
        return rejectWithValue("No car found for this VIN");
      }

      dispatch(setCatalogId(carData.catalogId));

      await dispatch(
        fetchGroups({
          catalogId: carData.catalogId,
          carId: carData.carId,
        })
      );

      return carData;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch car by VIN"
      );
    }
  }
);
