import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./components/App/App";
import { setLanguage } from "./store/language/languageSlice";

declare global {
  interface Window {
    __WIDGET_TOKEN__?: string;
    __WIDGET_LANGUAGE__?: string;
    __WIDGET_LINK__?: string;
  }
}

export function mountWidget(
  container: HTMLElement | ShadowRoot,
  options?: { token?: string; language?: string; link?: string }
) {
  if (options?.token) {
    window.__WIDGET_TOKEN__ = options.token;
  }

  if (options?.link) {
    window.__WIDGET_LINK__ = options.link;
  }

  if (options?.language) {
    store.dispatch(setLanguage(options.language));
  }

  const saved = localStorage.getItem("language");
  if (saved) {
    store.dispatch(setLanguage(saved));
  }

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
