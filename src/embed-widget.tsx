import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./components/App/App";
import { setLanguage } from "./store/language/languageSlice";
import { createWidgetPortal, prepareWidgetRoot } from "./styles/roots";

declare global {
  interface Window {
    __WIDGET_TOKEN__?: string;
    __WIDGET_LANGUAGE__?: string;
    __WIDGET_LINK__?: string;
    __WIDGET_ROOT__?: HTMLElement;
    __WIDGET_PORTAL_ROOT__?: HTMLElement;
    __WIDGET_FULL_VIEW__?: boolean;
  }
}

let stylesheetReady: Promise<void> | undefined;

function loadWidgetStyles() {
  if (import.meta.env.DEV) return Promise.resolve();
  if (!stylesheetReady) {
    stylesheetReady = new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL(/* @vite-ignore */ "./widget.css", import.meta.url).href;
      link.dataset.carcatStyles = "";
      link.onload = () => resolve();
      link.onerror = () => {
        link.remove();
        stylesheetReady = undefined;
        reject(new Error("Failed to load catalog styles"));
      };
      document.head.appendChild(link);
    });
  }
  return stylesheetReady;
}

export async function mountWidget(
  container: HTMLElement,
  options?: { token?: string; language?: string; link?: string; view?: string },
) {
  await loadWidgetStyles();
  if (options?.token) window.__WIDGET_TOKEN__ = options.token;
  if (options?.link) window.__WIDGET_LINK__ = options.link;
  if (options?.language) store.dispatch(setLanguage(options.language));
  window.__WIDGET_FULL_VIEW__ = options?.view === "full" || options?.view === "true";

  const saved = localStorage.getItem("language");
  if (saved) store.dispatch(setLanguage(saved));

  const previousClassName = container.className;
  const attributes = ["data-carcat-root", "data-carcat-theme", "data-carcat-palette"];
  const previousAttributes = attributes.map((attribute) => container.getAttribute(attribute));
  prepareWidgetRoot(container);
  window.__WIDGET_ROOT__ = container;
  const portalMount = createWidgetPortal();
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App portalMount={portalMount} />
      </Provider>
    </React.StrictMode>,
  );

  return () => {
    root.unmount();
    portalMount.remove();
    container.className = previousClassName;
    attributes.forEach((attribute, index) => {
      const value = previousAttributes[index];
      if (value === null) container.removeAttribute(attribute);
      else container.setAttribute(attribute, value);
    });
    if (window.__WIDGET_ROOT__ === container) delete window.__WIDGET_ROOT__;
    if (window.__WIDGET_PORTAL_ROOT__ === portalMount) delete window.__WIDGET_PORTAL_ROOT__;
  };
}
