import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parameters.types";
import { fetchParameters, fetchCarId } from "./parametersThunks";
import { fetchByVin } from "../groups/groupsThunks";

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    resetParameters(state) {
      state.parameters = [];
      state.selectedParameters = [];
      state.carId = null;
    },
    resetCarId(state) {
      state.carId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // get parameters
      .addCase(fetchParameters.pending, (state) => {
        state.parametersLoading = true;
        state.parametersError = null;
      })
      .addCase(fetchParameters.fulfilled, (state, action) => {
        state.parametersLoading = false;
        state.parametersError = null;

        const { data: newParams, appendedParameter } = action.payload;

        const oldCount = state.parameters.length;
        const newCount = newParams.length;

        if (newCount === oldCount) {
          return;
        }

        if (appendedParameter) {
          state.selectedParameters.push(appendedParameter);
        }

        state.parameters = newParams;
      })
      .addCase(fetchParameters.rejected, (state, action) => {
        state.parametersLoading = false;
        state.parametersError = action.payload as string;
      })

      // fetch carId
      .addCase(fetchCarId.pending, (state) => {
        state.parametersLoading = true;
        state.parametersError = null;
      })
      .addCase(fetchCarId.fulfilled, (state, action) => {
        state.carId = action.payload;
        state.parametersLoading = false;
        state.parametersError = null;
      })
      .addCase(fetchCarId.rejected, (state, action) => {
        state.parametersError = action.payload as string;
        state.parametersLoading = false;
        state.carId = null;
      })
      // fetch by vin
      .addCase(fetchByVin.pending, (state) => {
        state.parametersLoading = true;
        state.parametersError = null;
      })
      .addCase(fetchByVin.fulfilled, (state, action) => {
        state.parametersLoading = false;
        state.parametersError = null;

        state.carId = action.payload.carId;
      })
      .addCase(fetchByVin.rejected, (state, action) => {
        state.parametersLoading = false;
        state.parametersError = action.payload as string;
      });
  },
});

export const { resetParameters, resetCarId } = parametersSlice.actions;
export default parametersSlice.reducer;
