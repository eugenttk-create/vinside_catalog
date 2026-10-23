import "../../styles/common.module.css";
import styles from "./App.module.css";
import Widget from "../Widget/Widget";
import Catalog from "../Catalog/Catalog";
import { useModels } from "../../hooks/models/useModels";
import { useState, useEffect } from "react";
import { startCatalogNavigation } from "../../navigation/catalogNavigation";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../../hooks/UI/useLockBodyScroll";

interface AppProps {
  portalMount: HTMLElement;
}

const App: React.FC<AppProps> = ({ portalMount }) => {
  const [modelId, setModelId] = useState("");
  const { catalogOpened } = useModels();

  useEffect(() => startCatalogNavigation(setModelId), []);

  useLockBodyScroll(catalogOpened);

  return (
    <main className={styles["main"]}>
      <Widget />
      {catalogOpened &&
        createPortal(
          <Catalog modelId={modelId} setModelId={setModelId} />,
          portalMount
        )}
    </main>
  );
};

export default App;
