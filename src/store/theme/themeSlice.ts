import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

declare global {
  interface Window {
    __WIDGET_PORTAL_ROOT__?: ShadowRoot;
    __WIDGET_SHADOW_ROOT__?: ShadowRoot;
  }
}

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const STORAGE_KEY = "catalog-theme";

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  return "light";
};

const applyThemeToDom = (mode: ThemeMode) => {
  const setOn = (el: Element | null | undefined) => {
    if (el) el.setAttribute("data-carcat-theme", mode);
  };

  const portalShadow = window.__WIDGET_PORTAL_ROOT__;
  if (portalShadow) {
    setOn(portalShadow.host);
    setOn(portalShadow.getElementById("widget-catalog-portal"));
    setOn(portalShadow.getElementById("catalog-root"));
  }

  const widgetShadow = window.__WIDGET_SHADOW_ROOT__;
  if (widgetShadow) {
    setOn(widgetShadow.host);
  }

  if (!portalShadow) {
    setOn(document.getElementById("widget-catalog-portal"));
    setOn(document.getElementById("catalog-root"));
    setOn(document.getElementById("my-widget-portal-host"));
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
