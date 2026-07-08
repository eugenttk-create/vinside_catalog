import "./CatalogOEFilters.css";
import { useOE } from "../../../../../hooks/OE/useOE";
import { useMemo } from "react";

interface CatalogOEFiltersProps {
  selectedBrand: string;
  onBrandSelect: (brand: string) => void;
}

const CatalogOEFilters: React.FC<CatalogOEFiltersProps> = ({
  selectedBrand,
  onBrandSelect,
}) => {
  const { OE } = useOE();

  const uniqueBrands = useMemo(() => {
    if (!OE?.models) return [];
    return [...new Set(OE.models.map((m) => m.brand))];
  }, [OE]);

  return (
    <div className="oe-filters">
      <button
        className={`oe-filter-btn ${
          selectedBrand === "" ? "oe-filter-btn_active" : ""
        }`}
        onClick={() => onBrandSelect("")}
      >
        Все
      </button>
      {uniqueBrands.map((brand) => (
        <button
          key={brand}
          className={`oe-filter-btn ${
            selectedBrand === brand ? "oe-filter-btn_active" : ""
          }`}
          onClick={() => onBrandSelect(brand)}
        >
          {brand}
        </button>
      ))}
    </div>
  );
};

export default CatalogOEFilters;
