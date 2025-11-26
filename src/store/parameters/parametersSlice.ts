import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./parameters.types";

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
    //get parameters
  },
});

export default parametersSlice.reducer;
