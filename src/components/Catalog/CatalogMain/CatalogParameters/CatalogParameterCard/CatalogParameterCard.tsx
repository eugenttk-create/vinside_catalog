import CarImage from "../../../../../assets/car_cover.png";
import { useState } from "react";
import { X, Info } from "lucide-react";
import "./CatalogParameterCard.css";

interface CatalogParameterCardProps {
  imageSrc?: string;
  name: string;
  idx: string;
  onClick: (idx: string) => void;
  description: {
    model: string | null;
    productionFrom: string | null;
    salesTerm: string | null;
  } | null;
}

const CatalogParameterCard: React.FC<CatalogParameterCardProps> = ({
  imageSrc,
  name,
  idx,
  onClick,
  description,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleInfoButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsHovered(!isHovered);
  };

  return (
    <li
      className="catalog-parameter-card card"
      onClick={() => onClick(idx)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {description !== null && (
        <button
          type="button"
          className="catalog-parameter-card__info-icon"
          onClick={handleInfoButtonClick}
        >
          {isHovered ? <X className="icon" /> : <Info className="icon" />}
        </button>
      )}
      <img
        src={imageSrc ? imageSrc : CarImage}
        alt={`param-${idx}`}
        className="catalog-parameter-card__image image"
      />
      <p className="catalog-parameter-card__name title">{name}</p>
      {description !== null && (
        <ul
          className={`catalog-parameter-card__description card-description ${
            isHovered ? "card-description_visible" : ""
          }`}
        >
          <p className="catalog-parameter-card__description-title card-description-title">
            {name}
          </p>
          {description.model !== null && (
            <li className="catalog-parameter-card__description-el card-description-el">
              <p className="catalog-parameter-card__description-el-title card-description-el-title">
                Model
              </p>
              <p className="catalog-parameter-card__description-el-text card-description-el-text">
                {description.model}
              </p>
            </li>
          )}{" "}
          {description.productionFrom !== null &&
            description.productionFrom !== null && (
              <li className="catalog-parameter-card__description-el card-description-el">
                <p className="catalog-parameter-card__description-el-title card-description-el-title">
                  Production from
                </p>
                <p className="catalog-parameter-card__description-el-text card-description-el-text">
                  {description.productionFrom !== null &&
                    description.productionFrom}
                </p>
              </li>
            )}
          {description.salesTerm && (
            <li className="catalog-parameter-card__description-el card-description-el">
              <p className="catalog-parameter-card__description-el-title card-description-el-title">
                Sales term
              </p>
              <p className="catalog-parameter-card__description-el-text card-description-el-text">
                {description.salesTerm}
              </p>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default CatalogParameterCard;
