import shared from "../../../../../styles/common.module.css";
import CarImage from "../../../../../assets/car_cover.png";
import { useModels } from "../../../../../hooks/models/useModels";
import { resolveImageSrc } from "../../../../../utils/resolveImgSrc";

interface CatalogBrandCardProps {
  catalogId: string;
  name: string;
  imageSrc: string;
}

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
    <li className={`${shared["catalog-brand-card"]} ${shared["card"]}`} onClick={handleBrandClick}>
      <img
        src={resolveImageSrc(imageSrc)}
        loading="lazy"
        alt={`brand-${catalogId}`}
        className={`${shared["catalog-brand-card__image"]} ${shared["image"]}`}
        onError={handleImgError}
      />
      <p className={`${shared["catalog-brand-card__name"]} ${shared["title"]}`}>{name}</p>
    </li>
  );
};

export default CatalogBrandCard;
