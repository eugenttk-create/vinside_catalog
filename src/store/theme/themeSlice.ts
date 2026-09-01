import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const STORAGE_KEY = "catalog-theme";

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

const applyThemeToDom = (mode: ThemeMode) => {
  document.documentElement.setAttribute("data-theme", mode);
  const portal = document.getElementById("widget-catalog-portal");
  if (portal) {
    portal.setAttribute("data-theme", mode);
  }
  const catalogRoot = document.getElementById("catalog-root");
  if (catalogRoot) {
    catalogRoot.setAttribute("data-theme", mode);
  }
};

const initialMode = getInitialTheme();
applyThemeToDom(initialMode);

const initialState: ThemeState = {
  mode: initialMode,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
      applyThemeToDom(action.payload);
    },
    toggleTheme(state) {
      const next: ThemeMode = state.mode === "light" ? "dark" : "light";
      state.mode = next;
      localStorage.setItem(STORAGE_KEY, next);
      applyThemeToDom(next);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
