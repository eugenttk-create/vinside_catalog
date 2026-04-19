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

const BASE = "https://vinside.carcatonline.com";
const CSS = BASE + "/widget.css";
const CSS2 = BASE + "/widget2.css";

const CSS_VARIABLES = `
  :host {
    font-family: "Roboto", "Arial", "Helvetica", sans-serif;
    font-weight: 400;
    --bg-white: #fff;
    --bg-red: rgb(253, 240, 240);
    --bg-blue: rgb(240, 249, 255);
    --bg-gray: rgb(249, 250, 251);
    --text-color: rgb(12, 74, 110);
    --text-secondary: rgb(7, 89, 133);
    --white: #fff;
    --blue: rgb(14, 165, 233);
    --red: rgb(163, 22, 22);
    --green: rgb(85, 211, 59);
    --border-blue: rgba(14, 165, 233, 0.25);
    --border-active-blue: rgb(14, 165, 233);
  }

  * {
    font-family: "Roboto", "Arial", "Helvetica", sans-serif;
    font-weight: 400;
  }
`;

const FONT_BASE = "https://vinside.carcatonline.com/fonts";

function injectFontsToDocument() {
  if (document.getElementById("widget-fonts")) return;

  const style = document.createElement("style");
  style.id = "widget-fonts";
  style.textContent = `
    @font-face {
      font-family: "Roboto";
      src: url("${FONT_BASE}/Roboto-Regular.ttf") format("truetype");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${FONT_BASE}/Roboto-Medium.ttf") format("truetype");
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: "Roboto";
      src: url("${FONT_BASE}/Roboto-Bold.ttf") format("truetype");
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

function attachStyles(shadow: ShadowRoot) {
  const varStyle = document.createElement("style");
  varStyle.textContent = CSS_VARIABLES;
  shadow.appendChild(varStyle);

  [CSS, CSS2].forEach((href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    shadow.appendChild(link);
  });
}

export function mountWidget(
  container: HTMLElement | ShadowRoot,
  options?: { token?: string; language?: string; link?: string }
) {
  injectFontsToDocument();

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
  attachStyles(portalShadow);

  const portalMount = document.createElement("div");
  portalMount.id = "widget-catalog-portal";
  portalShadow.appendChild(portalMount);

  window.__WIDGET_PORTAL_ROOT__ = portalShadow;

  if (container instanceof ShadowRoot) {
    attachStyles(container);
  }

  ReactDOM.createRoot(container as Element).render(
    <React.StrictMode>
      <Provider store={store}>
        <App portalMount={portalMount} />
      </Provider>
    </React.StrictMode>
  );
}
