import styles from "./RegionSelectPopup.module.css";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Region {
  id: string;
  region: string;
}

interface RegionSelectPopupProps {
  isActive: boolean;
  regions: Region[];
  vin: string;
  onClose: () => void;
  onConfirm: (regionId: string) => void;
}

const REGION_LABELS: Record<string, string> = {
  BRAZIL: "Бразилия",
  MEXICO: "Мексика",
  ARGENTINA: "Аргентина",
};

const RegionSelectPopup: React.FC<RegionSelectPopupProps> = ({
  isActive,
  regions,
  vin,
  onClose,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    if (isActive) setSelectedId("");
  }, [isActive]);

  return (
    <div
      className={`${styles["region-select"]} ${isActive ? styles["region-select_active"] : ""}`}
      onClick={onClose}
    >
      <div
        className={styles["region-select__content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <X className={styles["region-select__close"]} onClick={onClose} />
        <p className={styles["region-select__title"]}>Выберите регион</p>
        <p className={styles["region-select__vin"]}>VIN: {vin}</p>
        <ul className={styles["region-select__list"]}>
          {regions.map((r) => (
            <li
              key={r.id}
              className={`${styles["region-select__el"]}${selectedId === r.id ? ` ${styles["region-select__el_active"]}` : ""}`}
              onClick={() => setSelectedId(r.id)}
            >
              <p className={styles["region-select__el-text"]}>
                {REGION_LABELS[r.region] ?? r.region}
              </p>
            </li>
          ))}
        </ul>
        <button
          className={styles["region-select__button"]}
          disabled={!selectedId}
          onClick={() => selectedId && onConfirm(selectedId)}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default RegionSelectPopup;
