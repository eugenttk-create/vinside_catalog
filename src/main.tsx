import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { createWidgetPortal, prepareWidgetRoot } from "./styles/roots";
import demo from "./styles/demo.module.css";
import App from "./components/App/App.tsx";

const container = document.getElementById("root")!;
container.dataset.carcatStandalone = "";
prepareWidgetRoot(container);
window.__WIDGET_ROOT__ = container;
document.body.classList.add(demo.page);
const portalMount = createWidgetPortal(true);

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App portalMount={portalMount} />
    </Provider>
  </StrictMode>
);
