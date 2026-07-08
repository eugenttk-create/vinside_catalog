import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parameters.types";
import { fetchParameters, fetchCarId } from "./parametersThunks";
import { fetchByVin } from "../groups/groupsThunks";
import { isAllParamsResponse } from "../../utils/parameters";

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    resetParameters(state) {
      state.parameters = [];
      state.selectedParameters = [];
      state.carId = null;
      state.isAllParamsMode = false;
      state.totalParamsCount = 0;
    },
    resetCarId(state) {
      state.carId = null;
    },
    setCarId(state, action) {
      state.carId = action.payload;
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

        if (newParams.length > 0 && isAllParamsResponse(newParams)) {
          if (!state.isAllParamsMode) {
            state.isAllParamsMode = true;
            state.totalParamsCount = newParams.length;
          }

          if (appendedParameter) {
            state.selectedParameters.push(appendedParameter);
          }

          state.parameters = newParams;
          return;
        }

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

        if (action.payload.type === "car") {
          state.carId = action.payload.carData.carId;
        }
      })
      .addCase(fetchByVin.rejected, (state, action) => {
        state.parametersLoading = false;
        state.parametersError = action.payload as string;
      });
  },
});

export const { resetParameters, resetCarId, setCarId } =
  parametersSlice.actions;
export default parametersSlice.reducer;
