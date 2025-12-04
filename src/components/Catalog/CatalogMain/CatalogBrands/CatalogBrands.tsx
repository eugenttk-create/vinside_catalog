import "./CatalogBrands.css";
import CatalogBrandCard from "./CatalogBrandCard/CatalogBrandCard";
import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";

const CatalogBrands: React.FC = () => {
  const { catalogs } = useCatalogs();

  return (
    <ul className="brands cards-section">
      {catalogs &&
        catalogs.map((brand) => {
          return (
            <CatalogBrandCard
              key={brand.id}
              catalogId={brand.id}
              name={brand.name}
            />
          );
        })}
    </ul>
  );
};

export default CatalogBrands;
