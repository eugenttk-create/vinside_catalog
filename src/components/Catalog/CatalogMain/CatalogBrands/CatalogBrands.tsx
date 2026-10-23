import styles from "./CatalogBrands.module.css";
import shared from "../../../../styles/common.module.css";
import CatalogBrandCard from "./CatalogBrandCard/CatalogBrandCard";
import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";

interface CatalogBrandsProps {}

const CatalogBrands: React.FC<CatalogBrandsProps> = ({}) => {
  const { catalogs } = useCatalogs();

  return (
    <ul className={`${styles["brands"]} ${shared["cards-section"]} ${shared["cards-section_grid"]}`}>
      {catalogs &&
        catalogs.map((brand) => {
          return (
            <CatalogBrandCard
              key={brand.id}
              catalogId={brand.id}
              name={brand.name}
              imageSrc={brand.img}
            />
          );
        })}
    </ul>
  );
};

export default CatalogBrands;
