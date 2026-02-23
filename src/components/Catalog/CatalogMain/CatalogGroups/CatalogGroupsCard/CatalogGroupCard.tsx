import "./CatalogGroupCard.css";
import { useGroups } from "../../../../../hooks/groups/useGroups";
import { useParts } from "../../../../../hooks/parts/useParts";
import { useModels } from "../../../../../hooks/models/useModels";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";
import {
  resolveImageSrc,
  FALLBACK_IMAGE,
} from "../../../../../utils/resolveImgSrc";
import { Info } from "lucide-react";
import type { GroupInfoPopupDescription } from "../../../../GroupInfoPopup/GroupInfoPopup";

interface CatalogGroupCardProps {
  carId: string;
  imageSrc?: string;
  name: string;
  idx: string;
  hasSubgroup: boolean;
  switchState: string;
  description: {
    illustration: string | null;
    name: string | null;
    description: string | null;
    restrictions: string | null;
    from: string | null;
    to: string | null;
    comment: string | null;
    remark: string | null;
    modelDescription: string | null;
    referenceNr: string | null;
    pet: string | null;
    pat: string | null;
    from_year: string | null;
    to_year: string | null;
    changePoint: string | null;
    code: string | null;
    mounting_time: string | null;
    equipment: string | null;
    subgroup: string | null;
  } | null;
  setIsInfoActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDescription: React.Dispatch<
    React.SetStateAction<GroupInfoPopupDescription>
  >;
  setPopupPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
}

const CatalogGroupCard: React.FC<CatalogGroupCardProps> = ({
  imageSrc,
  carId,
  name,
  idx,
  hasSubgroup,
  switchState,
  setIsInfoActive,
  setCurrentDescription,
  description,
  setPopupPosition,
}) => {
  const { catalogId } = useModels();
  const { getGroups } = useGroups();
  const { getParts } = useParts();
  const { handleAddBreadcrumb } = useBreadcrumbs();

  const handleCardClick = () => {
    if (hasSubgroup) {
      getGroups(catalogId, carId, idx);
      handleAddBreadcrumb("group", name, idx);
    } else {
      getParts(catalogId, carId, idx);
      handleAddBreadcrumb("part", name, idx);
    }
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
  };

  return (
    <li
      className={`catalog-group-card card ${
        switchState === "list" ? "card_list" : ""
      }`}
      onClick={handleCardClick}
    >
      {!description?.changePoint &&
      !description?.code &&
      !description?.comment &&
      !description?.description &&
      !description?.equipment &&
      !description?.from &&
      !description?.from_year &&
      !description?.illustration &&
      !description?.modelDescription &&
      !description?.mounting_time &&
      !description?.name &&
      !description?.pat &&
      !description?.pet &&
      !description?.referenceNr &&
      !description?.remark &&
      !description?.restrictions &&
      !description?.subgroup &&
      !description?.to &&
      !description?.to_year ? (
        <></>
      ) : (
        <button
          type="button"
          className="catalog-group-card__info-icon"
          onClick={handleInfoButtonClick}
        >
          <Info className="icon" />
        </button>
      )}
      <img
        src={resolveImageSrc(imageSrc)}
        alt={`param-${idx}`}
        className={`catalog-group-card__image image ${
          switchState === "list" ? "image_list" : ""
        }`}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <p
        className={`catalog-group-card__name title ${
          switchState === "list" ? "title_list" : ""
        }`}
        title={name}
      >
        {name}
      </p>
    </li>
  );
};

export default CatalogGroupCard;
