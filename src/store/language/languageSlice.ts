import { createSlice } from "@reduxjs/toolkit";

interface LanguageState {
  current: string;
}

const DEFAULT_LANGUAGE = "en";

const getInitialLanguage = (): string => {
  const saved = localStorage.getItem("language");
  if (saved) return saved;

  const fromAttribute = window.__WIDGET_LANGUAGE__;
  if (fromAttribute) return fromAttribute;

  return DEFAULT_LANGUAGE;
};

const initialState: LanguageState = {
  current: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.current = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
