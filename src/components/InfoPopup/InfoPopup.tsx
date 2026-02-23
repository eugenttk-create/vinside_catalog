import "./InfoPopup.css";
import type { InfoPopupDescription } from "../Catalog/CatalogMain/CatalogModels/CatalogModels";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/translation/useTranslation";

interface InfoPopupProps {
  isActive: boolean;
  description: InfoPopupDescription;
  onClose: () => void;
  position: { top: number; left: number };
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  isActive,
  description,
  onClose,
  position,
}) => {
  const { t } = useTranslation();

  const productionPeriod =
    description?.year_from && description?.year_to
      ? `${description.year_from} — ${description.year_to}`
      : description?.year_from
      ? `${description.year_from}`
      : description?.year_to
      ? `${description.year_to}`
      : null;

  return (
    <div
      className={`info-popup ${isActive ? "info-popup_active" : ""}`}
      style={{ top: position.top || "0", left: position.left || "0" }}
    >
      <button className="info-popup__close" onClick={onClose}>
        <X className="icon" />
      </button>
      <div className="info-popup__containers">
        {description?.model_type && (
          <div className="info-popup__container">
            <p className="info-popup__title">{t.widget_model_type}</p>
            <p className="info-popup__text">{description?.model_type}</p>
          </div>
        )}
        {productionPeriod && (
          <div className="info-popup__container">
            <p className="info-popup__title">{t.widget_production_period}</p>
            <p className="info-popup__text">{productionPeriod}</p>
          </div>
        )}
        {description?.series && (
          <div className="info-popup__container">
            <p className="info-popup__title">{t.widget_series}</p>
            <p className="info-popup__text">{description?.series}</p>
          </div>
        )}
        {description?.code && (
          <div className="info-popup__container">
            <p className="info-popup__title">Code</p>
            <p className="info-popup__text">{description?.code}</p>
          </div>
        )}
        {description?.sales_term && (
          <div className="info-popup__container">
            <p className="info-popup__title">Sales Term</p>
            <p className="info-popup__text">{description?.sales_term}</p>
          </div>
        )}
        {description?.sales_type && (
          <div className="info-popup__container">
            <p className="info-popup__title">Sales Type</p>
            <p className="info-popup__text">{description?.sales_type}</p>
          </div>
        )}
        {description?.catalog && (
          <div className="info-popup__container">
            <p className="info-popup__title">Catalog</p>
            <p className="info-popup__text">{description?.catalog}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPopup;
