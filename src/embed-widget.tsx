import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./components/App/App";

declare global {
  interface Window {
    __WIDGET_TOKEN__?: string;
    __WIDGET_LANGUAGE__?: string;
  }
}

export function mountWidget(
  container: HTMLElement | ShadowRoot,
  options?: { token?: string; language?: string }
) {
  if (options?.token) {
    window.__WIDGET_TOKEN__ = options.token;
  }

  if (options?.language) {
    window.__WIDGET_LANGUAGE__ = options.language;
  }

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
