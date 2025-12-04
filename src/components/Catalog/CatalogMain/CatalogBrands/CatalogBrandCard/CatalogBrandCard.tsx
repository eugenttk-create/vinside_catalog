import "./CatalogBrandCard.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useModels } from "../../../../../hooks/models/useModels";

interface CatalogBrandCardProps {
  catalogId: string;
  name: string;
}

const CatalogBrandCard: React.FC<CatalogBrandCardProps> = ({
  catalogId,
  name,
}) => {
  const { getModels, setCatalogId, handleSetSelectedBrand } = useModels();

  const handleBrandClick = () => {
    getModels(catalogId);
    setCatalogId(catalogId);
    handleSetSelectedBrand(name);
  };

  return (
    <li className="catalog-brand-card card" onClick={handleBrandClick}>
      <img
        src={CarImage}
        alt={`brand-${catalogId}`}
        className="catalog-brand-card__image image"
      />
      <p className="catalog-brand-card__name title">{name}</p>
    </li>
  );
};

export default CatalogBrandCard;
