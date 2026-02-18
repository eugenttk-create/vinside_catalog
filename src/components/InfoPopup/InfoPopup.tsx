import "./InfoPopup.css";
import type { InfoPopupDescription } from "../Catalog/CatalogMain/CatalogModels/CatalogModels";
import { X } from "lucide-react";

interface InfoPopupProps {
  isActive: boolean;
  description: InfoPopupDescription;
  onClose: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  isActive,
  description,
  onClose,
}) => {
  return (
    <div className={`info-popup ${isActive ? "info-popup_active" : ""}`}>
      <button className="info-popup__close" onClick={onClose}>
        <X className="icon" />
      </button>
      <div className="info-popup__containers">
        <div className="info-popup__container">
          <p className="info-popup__title">Model type</p>
          <p className="info-popup__text">{description?.modelType}</p>
        </div>
        <div className="info-popup__container">
          <p className="info-popup__title">Production Period</p>
          <p className="info-popup__text">
            {description?.productionFrom} &mdash; {description?.productionTo}
          </p>
        </div>
        <div className="info-popup__container">
          <p className="info-popup__title">Series</p>
          <p className="info-popup__text">{description?.series}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
