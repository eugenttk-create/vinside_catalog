import "./CatalogModelCard.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useParameters } from "../../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../../hooks/models/useModels";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";

interface CatalogModelCardProps {
  imageSrc?: string;
  modelId: string;
  name: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogModelCard: React.FC<CatalogModelCardProps> = ({
  imageSrc,
  modelId,
  name,
  setModelId,
}) => {
  const { catalogId } = useModels();
  const { getParameters } = useParameters();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const handleCardClick = () => {
    getParameters(catalogId, modelId, null);
    setModelId(modelId);
    handleAddBreadcrumb("model", name, modelId);
  };

  return (
    <li className="catalog-model-card card" onClick={handleCardClick}>
      <img
        src={imageSrc ? imageSrc : CarImage}
        alt={`model-${modelId}`}
        className="catalog-model-card__image image"
      />
      <p className="catalog-model-card__name title">{name}</p>
    </li>
  );
};

export default CatalogModelCard;
