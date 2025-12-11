import "./CatalogBrandCard.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useModels } from "../../../../../hooks/models/useModels";

interface CatalogBrandCardProps {
  catalogId: string;
  name: string;
  imageSrc: string;
}

const IMG_URL = import.meta.env.VITE_API_IMG_BASE;

const CatalogBrandCard: React.FC<CatalogBrandCardProps> = ({
  catalogId,
  name,
  imageSrc,
}) => {
  const { getModels, setCatalogId, handleSetSelectedBrand } = useModels();

  const handleBrandClick = () => {
    getModels(catalogId);
    setCatalogId(catalogId);
    handleSetSelectedBrand(name);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = CarImage;
  };

  return (
    <li className="catalog-brand-card card" onClick={handleBrandClick}>
      <img
        src={`${IMG_URL}${imageSrc}` || CarImage}
        loading="lazy"
        alt={`brand-${catalogId}`}
        className="catalog-brand-card__image image"
        onError={handleImgError}
      />
      <p className="catalog-brand-card__name title">{name}</p>
    </li>
  );
};

export default CatalogBrandCard;
