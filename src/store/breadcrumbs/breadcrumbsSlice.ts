import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./breadcrumbs.types";

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    addBreadcrumb: (state, action) => {
      if (state.currentIndex < state.breadcrumbs.length - 1) {
        state.breadcrumbs = state.breadcrumbs.slice(0, state.currentIndex + 1);
      }
      state.breadcrumbs.push(action.payload);
      state.currentIndex = state.breadcrumbs.length - 1;
    },
    trimBreadcrumbs: (state, action) => {
      state.breadcrumbs = state.breadcrumbs.slice(0, action.payload + 1);
      state.currentIndex = state.breadcrumbs.length - 1;
    },
    resetBreadcrumbs: (state) => {
      state.breadcrumbs = [];
      state.currentIndex = -1;
    },
    navigateToBreadcrumb: (state, action: { payload: number }) => {
      const idx = action.payload;
      if (idx >= -1 && idx < state.breadcrumbs.length) {
        state.currentIndex = idx;
      }
    },
  },
});

export const {
  addBreadcrumb,
  trimBreadcrumbs,
  resetBreadcrumbs,
  navigateToBreadcrumb,
} = breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
