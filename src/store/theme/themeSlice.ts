import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { getSavedPalette, type PaletteId } from "./palettes";


export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  palette: PaletteId;
}

const STORAGE_KEY = "catalog-theme";

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  return "light";
};

const applyThemeToDom = (mode: ThemeMode, palette: PaletteId) => {
  const setOn = (el: Element | null | undefined) => {
    if (el?.hasAttribute("data-carcat-root")) {
      el.setAttribute("data-carcat-theme", mode);
      el.setAttribute("data-carcat-palette", palette);
    }
  };

  setOn(window.__WIDGET_ROOT__);
  setOn(window.__WIDGET_PORTAL_ROOT__);
  setOn(document.getElementById("root"));
  setOn(document.getElementById("my-widget-root"));
  setOn(document.getElementById("widget-catalog-portal"));
  setOn(document.getElementById("catalog-root"));
};

const initialMode = getInitialTheme();
const initialPalette = getSavedPalette();
applyThemeToDom(initialMode, initialPalette);

const initialState: ThemeState = {
  mode: initialMode,
  palette: initialPalette,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
      applyThemeToDom(action.payload, state.palette);
    },
    toggleTheme(state) {
      const next: ThemeMode = state.mode === "light" ? "dark" : "light";
      state.mode = next;
      localStorage.setItem(STORAGE_KEY, next);
      applyThemeToDom(next, state.palette);
    },
    setPalette(state, action: PayloadAction<PaletteId>) {
      state.palette = action.payload;
      localStorage.setItem("catalog-palette", action.payload);
      applyThemeToDom(state.mode, action.payload);
    },
  },
});

export const { setTheme, toggleTheme, setPalette } = themeSlice.actions;
export default themeSlice.reducer;
