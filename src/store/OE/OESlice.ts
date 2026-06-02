import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../models/models.types";

const OESlice = createSlice({
  name: "OE",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder;
  },
});

export default OESlice.reducer;
