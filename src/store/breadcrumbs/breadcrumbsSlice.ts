import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./breadcrumbs.types";

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    trimBreadcrumbs: (state, action) => {
      state.breadcrumbs = state.breadcrumbs.slice(0, action.payload + 1);
    },
    resetBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

export const { addBreadcrumb, trimBreadcrumbs, resetBreadcrumbs } =
  breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
