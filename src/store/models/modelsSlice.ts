import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./models.types";
import { fetchModels } from "./modelsThunks";

const modelsSlice = createSlice({
  name: "models",
  initialState,
  reducers: {},
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

export default modelsSlice.reducer;
