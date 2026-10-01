import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./analogs.types";
import type { Analog } from "./analogs.types";
import {
  fetchAnalogs,
  fetchAnalogInfo,
  fetchApplicability,
} from "./analogsThunks";

const analogsSlice = createSlice({
  name: "analogs",
  initialState,
  reducers: {
    resetAnalogs: () => initialState,
    setIsAnalogsView: (state, action: PayloadAction<boolean>) => {
      state.isAnalogsView = action.payload;
      if (!action.payload) {
        state.isAnalogDetailView = false;
        state.selectedAnalog = null;
        state.analogInfo = null;
        state.applicability = [];
      }
    },
    setSelectedAnalog: (state, action: PayloadAction<Analog | null>) => {
      state.selectedAnalog = action.payload;
      state.isAnalogDetailView = !!action.payload;
      if (!action.payload) {
        state.analogInfo = null;
        state.applicability = [];
        state.selectedBrandId = null;
      }
    },
    setSelectedBrandId: (state, action: PayloadAction<number | null>) => {
      state.selectedBrandId = action.payload;
    },
    clearAnalogDetail: (state) => {
      state.selectedAnalog = null;
      state.isAnalogDetailView = false;
      state.analogInfo = null;
      state.applicability = [];
      state.selectedBrandId = null;
      state.analogInfoError = null;
      state.applicabilityError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalogs.pending, (state) => {
        state.analogsLoading = true;
        state.analogsError = null;
        state.isAnalogsView = true;
        state.isAnalogDetailView = false;
        state.selectedAnalog = null;
        state.analogInfo = null;
      })
      .addCase(fetchAnalogs.fulfilled, (state, action) => {
        state.analogsLoading = false;
        state.analogs = action.payload.analogs;
        state.searchQuery = action.payload.searchQuery;
        state.analogsError = null;
      })
      .addCase(fetchAnalogs.rejected, (state, action) => {
        state.analogsLoading = false;
        state.analogsError = action.payload as string;
        state.analogs = [];
      })
      .addCase(fetchAnalogInfo.pending, (state) => {
        state.analogInfoLoading = true;
        state.analogInfoError = null;
      })
      .addCase(fetchAnalogInfo.fulfilled, (state, action) => {
        state.analogInfoLoading = false;
        state.analogInfo = action.payload;
        state.analogInfoError = null;
        if (action.payload?.brands?.length > 0) {
          state.selectedBrandId = action.payload.brands[0].id;
        }
      })
      .addCase(fetchAnalogInfo.rejected, (state, action) => {
        state.analogInfoLoading = false;
        state.analogInfoError = action.payload as string;
      })
      .addCase(fetchApplicability.pending, (state) => {
        state.applicabilityLoading = true;
        state.applicabilityError = null;
      })
      .addCase(fetchApplicability.fulfilled, (state, action) => {
        state.applicabilityLoading = false;
        state.applicability = action.payload;
        state.applicabilityError = null;
      })
      .addCase(fetchApplicability.rejected, (state, action) => {
        state.applicabilityLoading = false;
        state.applicabilityError = action.payload as string;
        state.applicability = [];
      });
  },
});

export const {
  resetAnalogs,
  setIsAnalogsView,
  setSelectedAnalog,
  setSelectedBrandId,
  clearAnalogDetail,
} = analogsSlice.actions;

export default analogsSlice.reducer;
