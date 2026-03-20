import "./CatalogBrands.css";
import CatalogBrandCard from "./CatalogBrandCard/CatalogBrandCard";
import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";

interface CatalogBrandsProps {}

const CatalogBrands: React.FC<CatalogBrandsProps> = ({}) => {
  const { catalogs } = useCatalogs();

  return (
    <ul className="brands cards-section cards-section_grid">
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
