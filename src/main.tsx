import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import "./index.css";
import App from "./components/App/App.tsx";

const portalMount = document.createElement("div");
portalMount.id = "widget-catalog-portal";
document.body.appendChild(portalMount);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App portalMount={portalMount} />
    </Provider>
  </StrictMode>
);
