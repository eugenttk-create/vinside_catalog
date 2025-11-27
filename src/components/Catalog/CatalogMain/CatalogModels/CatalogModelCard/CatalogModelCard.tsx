import "./CatalogModelCard.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useParameters } from "../../../../../hooks/parameters/useParameters";

interface CatalogModelCardProps {
  imageSrc?: string;
  modelId: string;
  catalogId: string;
  name: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogModelCard: React.FC<CatalogModelCardProps> = ({
  imageSrc,
  modelId,
  catalogId,
  name,
  setModelId,
}) => {
  const { getParameters } = useParameters();

  const handleCardClick = () => {
    getParameters(catalogId, modelId, null);
    setModelId(modelId);
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
