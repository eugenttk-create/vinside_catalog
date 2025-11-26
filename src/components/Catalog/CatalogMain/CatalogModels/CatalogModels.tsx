import "./CatalogModels.css";
import CatalogModelCard from "./CatalogModelCard/CatalogModelCard";
import { useModels } from "../../../../hooks/models/useModels";

interface CatalogModelsProps {
  catalogId: string;
}

const CatalogModels: React.FC<CatalogModelsProps> = ({ catalogId }) => {
  const { models } = useModels();

  return (
    <div className="models cards-section">
      {models &&
        models.map((model) => {
          return (
            <CatalogModelCard
              modelId={model.id}
              imageSrc={model.img}
              key={model.id}
              name={model.name}
              catalogId={catalogId}
            />
          );
        })}
    </div>
  );
};

export default CatalogModels;
