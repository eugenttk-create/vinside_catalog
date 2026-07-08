import "./App.css";
import Widget from "../Widget/Widget";
import Catalog from "../Catalog/Catalog";
import { useModels } from "../../hooks/models/useModels";
import { useState } from "react";
import { createPortal } from "react-dom";

interface AppProps {
  portalMount: HTMLElement;
}

const App: React.FC<AppProps> = ({ portalMount }) => {
  const [modelId, setModelId] = useState("");
  const { catalogOpened } = useModels();

  return (
    <main className="main">
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
