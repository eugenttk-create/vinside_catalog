import CarImage from "../../../../../assets/car_cover.png";
import "./CatalogGroupCard.css";
import { useGroups } from "../../../../../hooks/groups/useGroups";
import { useParts } from "../../../../../hooks/parts/useParts";

const IMG_URL = import.meta.env.VITE_API_IMG_BASE;

interface CatalogGroupCardProps {
  catalogId: string;
  carId: string;
  imageSrc?: string;
  name: string;
  idx: string;
  hasSubgroup: boolean;
}

const CatalogGroupCard: React.FC<CatalogGroupCardProps> = ({
  imageSrc,
  carId,
  catalogId,
  name,
  idx,
  hasSubgroup,
}) => {
  const { getGroups } = useGroups();
  const { getParts } = useParts();

  const handleCardClick = () => {
    if (hasSubgroup) {
      getGroups(catalogId, carId, idx);
    } else {
      getParts(catalogId, carId, idx);
    }
  };

  return (
    <li className="catalog-group-card card" onClick={handleCardClick}>
      {" "}
      <img
        src={imageSrc ? `${IMG_URL}${imageSrc}` : CarImage}
        alt={`param-${idx}`}
        className="catalog-group-card__image image"
        loading="lazy"
      />
      <p className="catalog-group-card__name title" title={name}>
        {name}
      </p>
    </li>
  );
};

export default CatalogGroupCard;
