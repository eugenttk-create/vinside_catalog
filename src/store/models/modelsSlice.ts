import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./models.types";
import { fetchModels } from "./modelsThunks";

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    setCatalogId: (state, action) => {
      state.catalogId = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    resetModels: (state) => {
      state.models = [];
      state.modelsError = null;
      state.modelsLoading = false;
      state.catalogId = "";
    },
    openCatalog: (state) => {
      state.catalogOpened = true;
    },
    closeCatalog: (state) => {
      state.catalogOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //get models
      .addCase(fetchModels.pending, (state) => {
        (state.modelsLoading = true), (state.modelsError = null);
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.modelsLoading = false;
        state.modelsError = null;
        state.models = action.payload;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.modelsLoading = false;
        state.modelsError = action.payload as string;
      });
  },
});

export const {
  setCatalogId,
  resetModels,
  openCatalog,
  closeCatalog,
  setSelectedBrand,
} = modelsSlice.actions;
export default modelsSlice.reducer;
