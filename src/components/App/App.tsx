import "./App.css";
import Widget from "../Widget/Widget";
import Catalog from "../Catalog/Catalog";
import { useModels } from "../../hooks/models/useModels";
import { useState } from "react";

const App: React.FC = () => {
  const [modelId, setModelId] = useState("");
  const { catalogOpened } = useModels();

  return (
    <main className="main">
      <Widget />
      {catalogOpened && <Catalog modelId={modelId} setModelId={setModelId} />}
    </main>
  );
};

export default App;
