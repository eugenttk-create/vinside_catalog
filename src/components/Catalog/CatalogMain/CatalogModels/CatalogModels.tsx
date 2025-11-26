import "./CatalogModels.css";
import CatalogModelCard from "./CatalogModelCard/CatalogModelCard";
import { useModels } from "../../../../hooks/models/useModels";

interface CatalogModelsProps {
  catalogId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogModels: React.FC<CatalogModelsProps> = ({
  catalogId,
  setModelId,
}) => {
  const { models } = useModels();

  return (
    <ul className="models cards-section">
      {models &&
        models.map((model) => {
          return (
            <CatalogModelCard
              modelId={model.id}
              imageSrc={model.img}
              key={model.id}
              name={model.name}
              catalogId={catalogId}
              setModelId={setModelId}
            />
          );
        })}
    </ul>
  );
};

export default CatalogModels;
