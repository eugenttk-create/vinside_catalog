import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./catalogs.types";
import { fetchCatalogs } from "./catalogsThunks";

const catalogsSlice = createSlice({
  name: "catalogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get catalogs
      .addCase(fetchCatalogs.pending, (state) => {
        (state.catalogsLoading = true), (state.catalogsError = null);
      })
      .addCase(fetchCatalogs.fulfilled, (state, action) => {
        state.catalogsLoading = false;
        state.catalogsError = null;
        state.catalogs = action.payload;
      })
      .addCase(fetchCatalogs.rejected, (state, action) => {
        state.catalogsLoading = false;
        state.catalogsError = action.payload as string;
      });
  },
});

export default catalogsSlice.reducer;
