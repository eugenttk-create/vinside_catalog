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
    __WIDGET_PORTAL_ROOT__?: ShadowRoot;
  }
}

export function mountWidget(
  container: HTMLElement | ShadowRoot,
  options?: { token?: string; language?: string; link?: string }
) {
  if (options?.token) window.__WIDGET_TOKEN__ = options.token;
  if (options?.link) window.__WIDGET_LINK__ = options.link;
  if (options?.language) store.dispatch(setLanguage(options.language));

  const saved = localStorage.getItem("language");
  if (saved) store.dispatch(setLanguage(saved));

  const portalHost = document.createElement("div");
  portalHost.id = "my-widget-portal-host";

  portalHost.style.cssText = `
    all: initial;
    position: fixed;
    top: 0; left: 0;
    width: 0; height: 0;
    z-index: 2147483647;
    pointer-events: none;
  `;
  document.body.appendChild(portalHost);

  const portalShadow = portalHost.attachShadow({ mode: "open" });

  const CSS = "https://vinside.carcatonline.com/widget.css";
  const CSS2 = "https://vinside.carcatonline.com/widget2.css";
  [CSS, CSS2].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    portalShadow.appendChild(link);
  });

  const portalMount = document.createElement("div");
  portalMount.id = "widget-catalog-portal";
  portalShadow.appendChild(portalMount);

  window.__WIDGET_PORTAL_ROOT__ = portalShadow;

  ReactDOM.createRoot(container as Element).render(
    <React.StrictMode>
      <Provider store={store}>
        <App portalMount={portalMount} />
      </Provider>
    </React.StrictMode>
  );
}
