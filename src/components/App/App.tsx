import "./App.css";
import Widget from "../Widget/Widget";
import Catalog from "../Catalog/Catalog";
import { useModels } from "../../hooks/models/useModels";
import { useState } from "react";

const App: React.FC = () => {
  const [catalogId, setCatalogId] = useState("");
  const { models } = useModels();

  return (
    <main className="main">
      <Widget catalogId={catalogId} setCatalogId={setCatalogId} />
      {models.length > 0 && <Catalog catalogId={catalogId} />}
    </main>
  );
};

export default App;
