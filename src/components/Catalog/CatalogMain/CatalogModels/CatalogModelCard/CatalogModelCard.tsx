import "./CatalogModelCard.css";
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
  } | null;
  setIsInfoActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDescription: React.Dispatch<
    React.SetStateAction<InfoPopupDescription>
  >;
  switchState: string;
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
    setIsInfoActive(true);
    setCurrentDescription(description);
  };

  return (
    <li
      className={`catalog-model-card card ${
        switchState === "list" ? "card_list" : ""
      }`}
      onClick={handleCardClick}
    >
      {!description?.model_type &&
      !description?.series &&
      !description?.year_from &&
      !description?.year_to ? (
        <></>
      ) : (
        <button
          type="button"
          className="catalog-model-card__info-icon"
          onClick={handleInfoButtonClick}
        >
          <Info className="icon" />
        </button>
      )}
      <img
        src={resolveImageSrc(imageSrc)}
        alt={`model-${modelId}`}
        className={`catalog-model-card__image image ${
          switchState === "list" ? "image_list" : ""
        }`}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <p
        className={`catalog-model-card__name title ${
          switchState === "list" ? "title_list" : ""
        }`}
      >
        {name}
      </p>
    </li>
  );
};

export default CatalogModelCard;
