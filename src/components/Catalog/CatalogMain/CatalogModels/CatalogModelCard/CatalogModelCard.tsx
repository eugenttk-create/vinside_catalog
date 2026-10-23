import shared from "../../../../../styles/common.module.css";
import styles from "./CatalogModelCard.module.css";
import { useParameters } from "../../../../../hooks/parameters/useParameters";
import { useModels } from "../../../../../hooks/models/useModels";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";
import { Info } from "lucide-react";
import {
  resolveImageSrc,
  FALLBACK_IMAGE,
} from "../../../../../utils/resolveImgSrc";
import type { InfoPopupDescription } from "../CatalogModels";

interface CatalogModelCardProps {
  imageSrc?: string;
  modelId: string;
  name: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
  description: {
    model_type: string | null;
    year_from: string | null;
    year_to: string | null;
    series: string | null;
    code: string | null;
    catalog: string | null;
    cabin: string | null;
    engine: string | null;
    gearbox: string | null;
    steering: string | null;
    suspension: string | null;
    wheel_base: string | null;
    production: string | null;
    type: string | null;
  } | null;
  setIsInfoActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDescription: React.Dispatch<
    React.SetStateAction<InfoPopupDescription>
  >;
  switchState: string;
  setPopupPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
  activeCardId: string | null;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CatalogModelCard: React.FC<CatalogModelCardProps> = ({
  imageSrc,
  modelId,
  name,
  setModelId,
  description,
  setIsInfoActive,
  setCurrentDescription,
  switchState,
  setPopupPosition,
  setCurrentTitle,
  activeCardId,
  setActiveCardId,
}) => {
  const { catalogId } = useModels();
  const { getParameters } = useParameters();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const handleCardClick = () => {
    getParameters(catalogId, modelId, null);
    setModelId(modelId);
    handleAddBreadcrumb("model", name, modelId);
  };

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
    setActiveCardId(modelId);
  };

  return (
    <li
      className={`${shared["catalog-group-card"]} ${shared["card"]} ${switchState === "list" ? shared["card_list"] : ""} ${activeCardId === modelId ? shared["card_hovered"] : ""}`}
      onClick={handleCardClick}
    >
      {!description?.model_type &&
      !description?.code &&
      !description?.series &&
      !description?.year_from &&
      !description?.year_to &&
      !description?.catalog &&
      !description?.cabin &&
      !description?.engine &&
      !description?.gearbox &&
      !description?.steering &&
      !description?.suspension &&
      !description?.wheel_base &&
      !description?.production &&
      !description?.type ? (
        <></>
      ) : (
        <button
          type="button"
          className={styles["catalog-model-card__info-icon"]}
          onClick={handleInfoButtonClick}
        >
          <Info className={shared["icon"]} />
        </button>
      )}
      <img
        src={resolveImageSrc(imageSrc)}
        alt={`model-${modelId}`}
        className={`${shared["catalog-model-card__image"]} ${shared["image"]} ${switchState === "list" ? shared["image_list"] : ""}`}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <p
        className={`${shared["catalog-model-card__name"]} ${shared["title"]} ${switchState === "list" ? shared["title_list"] : ""}`}
      >
        {name}
      </p>
    </li>
  );
};

export default CatalogModelCard;
