import "./App.css";
import Widget from "../Widget/Widget";
import Catalog from "../Catalog/Catalog";
import { useModels } from "../../hooks/models/useModels";
import { useParameters } from "../../hooks/parameters/useParameters";
import { useState } from "react";

const App: React.FC = () => {
  const [modelId, setModelId] = useState("");
  const { models } = useModels();
  const { carId } = useParameters();

  const showCatalog = models.length > 0 || !!carId;

  return (
    <main className="main">
      <Widget />
      {showCatalog && <Catalog modelId={modelId} setModelId={setModelId} />}
    </main>
  );
};

export default App;
