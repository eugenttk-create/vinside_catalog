import styles from "./scope.module.css";
import normalize from "../vendor/normalize.module.css";
import { getSavedPalette } from "../store/theme/palettes";

export function prepareWidgetRoot(element: HTMLElement, portal = false) {
  element.dataset.carcatRoot = "";
  element.classList.add(styles.scope, normalize.normalize);
  if (portal) element.classList.add(styles.portal);
  const saved = localStorage.getItem("catalog-theme");
  element.dataset.carcatTheme = saved === "dark" ? "dark" : "light";
  element.dataset.carcatPalette = getSavedPalette();
}

export function createWidgetPortal(standalone = false) {
  const portal = document.createElement("div");
  portal.id = "widget-catalog-portal";
  if (standalone) portal.dataset.carcatStandalone = "";
  prepareWidgetRoot(portal, true);
  document.body.appendChild(portal);
  window.__WIDGET_PORTAL_ROOT__ = portal;
  return portal;
}
