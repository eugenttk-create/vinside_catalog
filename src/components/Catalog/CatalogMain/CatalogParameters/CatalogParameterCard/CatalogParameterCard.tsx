import CarImage from "../../../../../assets/car_cover.png";
import "./CatalogParameterCard.css";

interface CatalogParameterCardProps {
  imageSrc?: string;
  name: string;
  idx: string;
  onClick: (idx: string) => void;
}

const CatalogParameterCard: React.FC<CatalogParameterCardProps> = ({
  imageSrc,
  name,
  idx,
  onClick,
}) => {
  return (
    <li className="catalog-parameter-card card" onClick={() => onClick(idx)}>
      <img
        src={imageSrc ? imageSrc : CarImage}
        alt={`param-${idx}`}
        className="catalog-parameter-card__image image"
      />
      <p className="catalog-parameter-card__name title">{name}</p>
    </li>
  );
};

export default CatalogParameterCard;
