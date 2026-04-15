import "./InfoPopup.css";
import type { InfoPopupDescription } from "../Catalog/CatalogMain/CatalogModels/CatalogModels";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/translation/useTranslation";
import formatDate from "../../utils/formatDate";

interface InfoPopupProps {
  isActive: boolean;
  description: InfoPopupDescription;
  onClose: () => void;
  position: { top: number; left: number };
  title: string;
}

const InfoPopup: React.FC<InfoPopupProps> = ({
  isActive,
  description,
  onClose,
  position,
  title,
}) => {
  const { t } = useTranslation();

  const productionPeriod =
    description?.year_from && description?.year_to
      ? `${formatDate(description.year_from)} — ${formatDate(
          description.year_to
        )}`
      : description?.year_from
      ? `${formatDate(description.year_from)}`
      : description?.year_to
      ? `${formatDate(description.year_to)}`
      : null;

  return (
    <>
      <div
        className={`info-popup__overlay ${
          isActive ? "info-popup__overlay_active" : ""
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`info-popup ${isActive ? "info-popup_active" : ""}`}
        style={{ top: position.top || "0", left: position.left || "0" }}
      >
        <button className="info-popup__close" onClick={onClose}>
          <X className="icon" />
        </button>
        <p className="info-popup__top-title">{title}</p>
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
              <p className="info-popup__title">{t.widget_code}</p>
              <p className="info-popup__text">{description?.code}</p>
            </div>
          )}
          {description?.sales_term && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_sales_term}</p>
              <p className="info-popup__text">{description?.sales_term}</p>
            </div>
          )}
          {description?.sales_type && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_sales_type}</p>
              <p className="info-popup__text">{description?.sales_type}</p>
            </div>
          )}
          {description?.catalog && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_catalog}</p>
              <p className="info-popup__text">{description?.catalog}</p>
            </div>
          )}
          {description?.cabin && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_cabin}</p>
              <p className="info-popup__text">{description?.cabin}</p>
            </div>
          )}
          {description?.catalog && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_catalog}</p>
              <p className="info-popup__text">{description?.catalog}</p>
            </div>
          )}
          {description?.engine && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_engine}</p>
              <p className="info-popup__text">{description?.engine}</p>
            </div>
          )}
          {description?.gearbox && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_gearbox}</p>
              <p className="info-popup__text">{description?.gearbox}</p>
            </div>
          )}
          {description?.steering && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_steering}</p>
              <p className="info-popup__text">{description?.steering}</p>
            </div>
          )}
          {description?.suspension && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_suspension}</p>
              <p className="info-popup__text">{description?.suspension}</p>
            </div>
          )}
          {description?.wheel_base && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_wheel_base}</p>
              <p className="info-popup__text">{description?.wheel_base}</p>
            </div>
          )}
          {description?.type && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_model_type}</p>
              <p className="info-popup__text">{description?.type}</p>
            </div>
          )}
          {description?.production && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_production_period}</p>
              <p className="info-popup__text">{description?.production}</p>
            </div>
          )}
          {description?.pet && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_pet}</p>
              <p className="info-popup__text">{description?.pet}</p>
            </div>
          )}
          {description?.pat && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_pat}</p>
              <p className="info-popup__text">{description?.pat}</p>
            </div>
          )}
          {description?.prefix && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_prefix}</p>
              <p className="info-popup__text">{description?.prefix}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoPopup;
