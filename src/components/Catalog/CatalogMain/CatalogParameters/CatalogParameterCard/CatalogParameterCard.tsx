import { Info } from "lucide-react";
import "./CatalogParameterCard.css";
import {
  resolveImageSrc,
  FALLBACK_IMAGE,
} from "../../../../../utils/resolveImgSrc";
import type { InfoPopupDescription } from "../../CatalogModels/CatalogModels";

interface CatalogParameterCardProps {
  imageSrc?: string;
  name: string;
  idx: string;
  onClick: (idx: string) => void;
  description: {
    code: string | null;
    year_from: string | null;
    year_to: string | null;
    sales_term: string | null;
    sales_type: string | null;
  } | null;
  switchState: string;
  setIsInfoActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDescription: React.Dispatch<
    React.SetStateAction<InfoPopupDescription>
  >;
}

const CatalogParameterCard: React.FC<CatalogParameterCardProps> = ({
  imageSrc,
  name,
  idx,
  onClick,
  description,
  switchState,
  setIsInfoActive,
  setCurrentDescription,
}) => {
  const handleInfoButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsInfoActive(true);
    setCurrentDescription(description);
  };

  return (
    <li
      className={`catalog-parameter-card card ${
        switchState === "list" ? "card_list" : ""
      }`}
      onClick={() => onClick(idx)}
    >
      {!description?.code &&
      !description?.year_from &&
      !description?.year_to &&
      !description?.sales_term &&
      !description?.sales_type ? (
        <></>
      ) : (
        <button
          type="button"
          className="catalog-parameter-card__info-icon"
          onClick={handleInfoButtonClick}
        >
          <Info className="icon" />
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
    </li>
  );
};

export default CatalogParameterCard;
