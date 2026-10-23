import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parts.types";
import { fetchParts } from "./partsThunks";
import { fetchOEParts } from "../OE/OEThunks";

const partsSlice = createSlice({
  name: "parts",
  initialState,
  reducers: {
    resetParts: (state) => {
      state.parts = initialState.parts;
      state.loadedGroupId = undefined;
      state.partsError = null;
      state.partsLoading = false;
    },
    setParts: (state, action) => {
      state.parts = action.payload;
      state.loadedGroupId = undefined;
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
        state.loadedGroupId = action.meta.arg.groupId;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.partsLoading = false;
        state.partsError = action.payload as string;
      })
      //get OE parts
      .addCase(fetchOEParts.pending, (state) => {
        state.partsLoading = true;
        state.partsError = null;
      })
      .addCase(fetchOEParts.fulfilled, (state, action) => {
        state.partsLoading = false;
        state.partsError = null;
        state.parts = action.payload;
        state.loadedGroupId = action.meta.arg;
      })
      .addCase(fetchOEParts.rejected, (state, action) => {
        state.partsLoading = false;
        state.partsError = action.payload as string;
      });
  },
});

export const { resetParts, setParts } = partsSlice.actions;
export default partsSlice.reducer;
