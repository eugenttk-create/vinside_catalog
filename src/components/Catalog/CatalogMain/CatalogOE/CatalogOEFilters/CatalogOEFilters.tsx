import styles from "./CatalogOEFilters.module.css";
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
    <div className={styles["oe-filters"]}>
      <button
        className={`${styles["oe-filter-btn"]} ${selectedBrand === "" ? styles["oe-filter-btn_active"] : ""}`}
        onClick={() => onBrandSelect("")}
      >
        Все
      </button>
      {uniqueBrands.map((brand) => (
        <button
          key={brand}
          className={`${styles["oe-filter-btn"]} ${selectedBrand === brand ? styles["oe-filter-btn_active"] : ""}`}
          onClick={() => onBrandSelect(brand)}
        >
          {brand}
        </button>
      ))}
    </div>
  );
};

export default CatalogOEFilters;
