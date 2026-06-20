import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./OE.types";
import { fetchOE } from "./OEThunks";

const OESlice = createSlice({
  name: "OE",
  initialState,
  reducers: {
    resetOE: (state) => {
      state.OE = null;
      state.isOESearch = false;
    },
    setIsOESearch: (state, action) => {
      state.isOESearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //get oe
      .addCase(fetchOE.pending, (state) => {
        state.OELoading = true;
        state.OEError = null;
      })
      .addCase(fetchOE.fulfilled, (state, action) => {
        state.OELoading = false;
        state.OEError = null;
        state.OE = action.payload;
      })
      .addCase(fetchOE.rejected, (state, action) => {
        state.OELoading = false;
        state.OEError = action.payload as string;
      });
  },
});

export const { resetOE, setIsOESearch } = OESlice.actions;
export default OESlice.reducer;
