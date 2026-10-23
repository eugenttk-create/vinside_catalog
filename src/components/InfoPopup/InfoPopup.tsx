import styles from "./InfoPopup.module.css";
import shared from "../../styles/common.module.css";
import type { InfoPopupDescription } from "../Catalog/CatalogMain/CatalogModels/CatalogModels";
import { X } from "lucide-react";
import { orderCatalogFields } from "../../utils/orderCatalogFields";
import { useTranslation } from "../../hooks/translation/useTranslation";

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
      ? `${description.year_from} — ${description.year_to}`
      : description?.year_from
      ? description.year_from
      : description?.year_to
      ? description.year_to
      : null;

  const fields = orderCatalogFields(
    [
      { key: "model_type", label: t.widget_model_type, value: description?.model_type },
      { key: "production_period", label: t.widget_production_period, value: productionPeriod },
      { key: "series", label: t.widget_series, value: description?.series },
      { key: "code", label: t.widget_code, value: description?.code },
      { key: "sales_term", label: t.widget_sales_term, value: description?.sales_term },
      { key: "sales_type", label: t.widget_sales_type, value: description?.sales_type },
      { key: "catalog", label: t.widget_catalog, value: description?.catalog },
      { key: "cabin", label: t.widget_cabin, value: description?.cabin },
      { key: "catalog-repeat", label: t.widget_catalog, value: description?.catalog },
      { key: "engine", label: t.widget_engine, value: description?.engine },
      { key: "gearbox", label: t.widget_gearbox, value: description?.gearbox },
      { key: "steering", label: t.widget_steering, value: description?.steering },
      { key: "suspension", label: t.widget_suspension, value: description?.suspension },
      { key: "wheel_base", label: t.widget_wheel_base, value: description?.wheel_base },
      { key: "type", label: t.widget_model_type, value: description?.type },
      { key: "production", label: t.widget_production_period, value: description?.production },
      { key: "pet", label: t.widget_pet, value: description?.pet },
      { key: "pat", label: t.widget_pat, value: description?.pat },
      { key: "prefix", label: t.widget_prefix, value: description?.prefix },
      { key: "pic", label: t.widget_pic, value: description?.pic },
    ],
    (field) => field.key
  ).filter((field) => field.value);

  return (
    <>
      <div
        className={`${styles["info-popup__overlay"]} ${isActive ? styles["info-popup__overlay_active"] : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`${styles["info-popup"]} ${isActive ? styles["info-popup_active"] : ""}`}
        style={{ top: position.top || "0", left: position.left || "0" }}
      >
        <button className={styles["info-popup__close"]} onClick={onClose}>
          <X className={shared["icon"]} />
        </button>
        <p className={styles["info-popup__top-title"]}>{title}</p>
        <div className={styles["info-popup__containers"]}>
          {fields.map((field) => (
            <div key={field.key} className={styles["info-popup__container"]}>
              <p className={styles["info-popup__title"]}>{field.label}</p>
              <p className={styles["info-popup__text"]}>{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InfoPopup;
