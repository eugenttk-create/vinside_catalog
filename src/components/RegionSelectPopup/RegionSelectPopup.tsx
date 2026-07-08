import "./RegionSelectPopup.css";
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
      className={`region-select ${isActive ? "region-select_active" : ""}`}
      onClick={onClose}
    >
      <div
        className="region-select__content"
        onClick={(e) => e.stopPropagation()}
      >
        <X className="region-select__close" onClick={onClose} />
        <p className="region-select__title">Выберите регион</p>
        <p className="region-select__vin">VIN: {vin}</p>
        <ul className="region-select__list">
          {regions.map((r) => (
            <li
              key={r.id}
              className={`region-select__el${
                selectedId === r.id ? " region-select__el_active" : ""
              }`}
              onClick={() => setSelectedId(r.id)}
            >
              <p className="region-select__el-text">
                {REGION_LABELS[r.region] ?? r.region}
              </p>
            </li>
          ))}
        </ul>
        <button
          className="region-select__button"
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
