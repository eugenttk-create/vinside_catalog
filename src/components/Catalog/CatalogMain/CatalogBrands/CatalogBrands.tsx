import "./CatalogBrands.css";
import CatalogBrandCard from "./CatalogBrandCard/CatalogBrandCard";
import { useCatalogs } from "../../../../hooks/catalogs/useCatalogs";

interface CatalogBrandsProps {
  switchState: string;
}

const CatalogBrands: React.FC<CatalogBrandsProps> = ({ switchState }) => {
  const { catalogs } = useCatalogs();

  return (
    <ul
      className={`brands cards-section ${
        switchState === "cards" ? "cards-section_grid" : "cards-section_list"
      }`}
    >
      {catalogs &&
        catalogs.map((brand) => {
          return (
            <CatalogBrandCard
              key={brand.id}
              catalogId={brand.id}
              name={brand.name}
              imageSrc={brand.img}
              switchState={switchState}
            />
          );
        })}
    </ul>
  );
};

export default CatalogBrands;
