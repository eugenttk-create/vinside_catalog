import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./components/App/App";

declare global {
  interface Window {
    __WIDGET_TOKEN__?: string;
  }
}

export function mountWidget(
  container: HTMLElement | ShadowRoot,
  options?: { token?: string }
) {
  const token = options?.token;

  if (token) {
    window.__WIDGET_TOKEN__ = token;
  }

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}
