import { useState } from "react";
import { X, Info } from "lucide-react";
import "./CatalogParameterCard.css";
import {
  resolveImageSrc,
  FALLBACK_IMAGE,
} from "../../../../../utils/resolveImgSrc";

interface CatalogParameterCardProps {
  imageSrc?: string;
  name: string;
  idx: string;
  onClick: (idx: string) => void;
  description: {
    model: string | null;
    productionFrom: string | null;
    salesTerm: string | null;
    salesType?: string | null;
  } | null;
  switchState: string;
}

const CatalogParameterCard: React.FC<CatalogParameterCardProps> = ({
  imageSrc,
  name,
  idx,
  onClick,
  description,
  switchState,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleInfoButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsHovered(!isHovered);
  };

  return (
    <li
      className={`catalog-parameter-card card ${
        switchState === "list" ? "card_list" : ""
      }`}
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
        src={resolveImageSrc(imageSrc)}
        alt={`param-${idx}`}
        className={`catalog-parameter-card__image image ${
          switchState === "list" ? "image_list" : ""
        }`}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <p
        className={`catalog-parameter-card__name title ${
          switchState === "list" ? "title_list" : ""
        }`}
        title={name}
      >
        {name}
      </p>
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
          {description.salesType && (
            <li className="catalog-parameter-card__description-el card-description-el">
              <p className="catalog-parameter-card__description-el-title card-description-el-title">
                Sales type
              </p>
              <p className="catalog-parameter-card__description-el-text card-description-el-text">
                {description.salesType}
              </p>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default CatalogParameterCard;
