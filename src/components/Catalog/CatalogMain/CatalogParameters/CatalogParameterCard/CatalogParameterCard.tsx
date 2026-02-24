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
    catalog: string | null;
    cabin: string | null;
    engine: string | null;
    gearbox: string | null;
    steering: string | null;
    suspension: string | null;
    wheel_base: string | null;
  } | null;
  switchState: string;
  setIsInfoActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDescription: React.Dispatch<
    React.SetStateAction<InfoPopupDescription>
  >;
  setPopupPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
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
  setPopupPosition,
  setCurrentTitle,
}) => {
  const handleInfoButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const popupWidth = 300;
    const popupHeight = 300;
    const margin = 8;

    let left = rect.right + margin;
    let top = rect.top;

    if (left + popupWidth > window.innerWidth - margin) {
      left = rect.left - popupWidth - margin;
    }

    if (left < margin) {
      left = Math.max(margin, (window.innerWidth - popupWidth) / 2);
    }

    if (top + popupHeight > window.innerHeight - margin) {
      top = window.innerHeight - popupHeight - margin;
    }

    if (top < margin) top = margin;

    setIsInfoActive(true);
    setCurrentDescription(description);
    setPopupPosition({ top, left });
    setCurrentTitle(name);
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
      !description?.sales_type &&
      !description?.cabin &&
      !description?.catalog &&
      !description?.engine &&
      !description?.gearbox &&
      !description?.steering &&
      !description?.suspension &&
      !description?.wheel_base ? (
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
