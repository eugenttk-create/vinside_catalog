import "./CatalogModelCard.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useParameters } from "../../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../../hooks/models/useModels";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";
import { useState } from "react";
import { Info, X } from "lucide-react";

interface CatalogModelCardProps {
  imageSrc?: string;
  modelId: string;
  name: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  description: {
    modelType: string | null;
    productionFrom: string | null;
    productionTo: string | null;
    series: string | null;
  } | null;
}

const IMG_URL = import.meta.env.VITE_API_IMG_BASE;

const CatalogModelCard: React.FC<CatalogModelCardProps> = ({
  imageSrc,
  modelId,
  name,
  setModelId,
  description,
}) => {
  const { catalogId } = useModels();
  const { getParameters } = useParameters();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    getParameters(catalogId, modelId, null);
    setModelId(modelId);
    handleAddBreadcrumb("model", name, modelId);
  };

  const handleInfoButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsHovered(!isHovered);
  };

  return (
    <li
      className="catalog-model-card card"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {description !== null && (
        <button
          type="button"
          className="catalog-model-card__info-icon"
          onClick={handleInfoButtonClick}
        >
          {isHovered ? <X className="icon" /> : <Info className="icon" />}
        </button>
      )}
      <>
        <img
          src={imageSrc ? `${IMG_URL}${imageSrc}` : CarImage}
          alt={`model-${modelId}`}
          className="catalog-model-card__image image"
        />
        <p className="catalog-model-card__name title">{name}</p>
      </>
      {description !== null && (
        <ul
          className={`catalog-model-card__description card-description ${
            isHovered ? "card-description_visible" : ""
          }`}
        >
          <p className="catalog-model-card__description-title card-description-title">
            {name}
          </p>
          {description.modelType !== null && (
            <li className="catalog-model-card__description-el card-description-el">
              <p className="catalog-model-card__description-el-title card-description-el-title">
                Model Type
              </p>
              <p className="catalog-model-card__description-el-text card-description-el-text">
                {description.modelType}
              </p>
            </li>
          )}{" "}
          {description.productionFrom !== null &&
            description.productionTo !== null && (
              <li className="catalog-model-card__description-el card-description-el">
                <p className="catalog-model-card__description-el-title card-description-el-title">
                  Production Period
                </p>
                <p className="catalog-model-card__description-el-text card-description-el-text">
                  {description.productionFrom !== null &&
                    description.productionFrom}{" "}
                  {description.productionFrom !== null &&
                    description.productionTo !== null &&
                    "/"}{" "}
                  {description.productionTo !== null &&
                    description.productionTo}
                </p>
              </li>
            )}
          {description.series && (
            <li className="catalog-model-card__description-el card-description-el">
              <p className="catalog-model-card__description-el-title card-description-el-title">
                Series
              </p>
              <p className="catalog-model-card__description-el-text card-description-el-text">
                {description.series}
              </p>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default CatalogModelCard;
