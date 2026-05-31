import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parts.types";
import { fetchParts, fetchPartsBySearchQuery } from "./partsThunks";

const partsSlice = createSlice({
  name: "parts",
  initialState,
  reducers: {
    resetParts: (state) => {
      state.parts = initialState.parts;
      state.partsError = null;
      state.partsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //get parts
      .addCase(fetchParts.pending, (state) => {
        state.partsLoading = true;
        state.partsError = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.partsLoading = false;
        state.partsError = null;
        state.parts = action.payload;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.partsLoading = false;
        state.partsError = action.payload as string;
      })
      //search parts
      .addCase(fetchPartsBySearchQuery.pending, (state) => {
        state.partsLoading = true;
        state.partsError = null;
      })
      .addCase(fetchPartsBySearchQuery.fulfilled, (state, action) => {
        state.partsLoading = false;
        state.partsError = null;
        state.parts = action.payload;
      })
      .addCase(fetchPartsBySearchQuery.rejected, (state, action) => {
        state.partsLoading = false;
        state.partsError = action.payload as string;
      });
  },
});

export const { resetParts } = partsSlice.actions;
export default partsSlice.reducer;
