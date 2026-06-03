import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { setCatalogId } from "../models/modelsSlice";
import { setParts } from "../parts/partsSlice";

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

      await dispatch(fetchVinInfo(carData.vin));

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

export const fetchVinInfo = createAsyncThunk(
  "groups/fetchVinInfo",
  async (vin: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/car/vin-info?q=${vin}`);
      return response.data[0];
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

export const fetchGroupsBySearchQuery = createAsyncThunk(
  "groups/fetchGroupsBySearchQuery",
  async (
    { catalogId, carId, q }: { catalogId: string; carId: string; q: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await api.get(
        `/search/${catalogId}/ai?carId=${carId}&query=${q}`
      );

      const data = response.data;
      const isPartsResponse = !Array.isArray(data) && "partGroups" in data;

      if (isPartsResponse) {
        dispatch(setParts(data));
        return {
          type: "parts" as const,
          parentId: null,
          children: [],
          flat: [],
        };
      }

      return {
        type: "groups" as const,
        parentId: null,
        children: data,
        flat: data,
      };
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.detail ?? "Failed to search");
    }
  }
);
