import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parts.types";
import { fetchParts } from "./partsThunks";

const partsSlice = createSlice({
  name: "parts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get parts
      .addCase(fetchParts.pending, (state) => {
        (state.partsLoading = true), (state.partsError = null);
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.partsLoading = false;
        state.partsError = null;
        state.parts = action.payload;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.partsLoading = false;
        state.partsError = action.payload as string;
      });
  },
});

export default partsSlice.reducer;
