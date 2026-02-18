import CarImage from "../../../../../assets/car_cover.png";
import "./CatalogGroupCard.css";
import { useGroups } from "../../../../../hooks/groups/useGroups";
import { useParts } from "../../../../../hooks/parts/useParts";
import { useModels } from "../../../../../hooks/models/useModels";
import { useBreadcrumbs } from "../../../../../hooks/breadcrumbs/useBreadcrumbs";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";

interface CatalogGroupCardProps {
  carId: string;
  imageSrc?: string;
  name: string;
  idx: string;
  hasSubgroup: boolean;
  switchState: string;
}

const CatalogGroupCard: React.FC<CatalogGroupCardProps> = ({
  imageSrc,
  carId,
  name,
  idx,
  hasSubgroup,
  switchState,
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

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = CarImage;
  };

  return (
    <li
      className={`catalog-group-card card ${
        switchState === "list" ? "card_list" : ""
      }`}
      onClick={handleCardClick}
    >
      <img
        src={resolveImageSrc(imageSrc)}
        alt={`param-${idx}`}
        className={`catalog-group-card__image image ${
          switchState === "list" ? "image_list" : ""
        }`}
        loading="lazy"
        onError={handleImgError}
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
