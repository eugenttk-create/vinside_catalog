import { createSlice } from "@reduxjs/toolkit";

interface LanguageState {
  current: string;
}

const DEFAULT_LANGUAGE = "en";

const getInitialLanguage = (): string => {
  return localStorage.getItem("language") ?? DEFAULT_LANGUAGE;
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
