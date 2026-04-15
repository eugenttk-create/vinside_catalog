import "../InfoPopup/InfoPopup.css";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/translation/useTranslation";

export type GroupInfoPopupDescription = {
  illustration: string | null;
  name: string | null;
  description: string | null;
  restriction: string | null;
  from: string | null;
  to: string | null;
  comment: string | null;
  remark: string | null;
  modelDescription: string | null;
  referenceNr: string | null;
  pet: string | null;
  pat: string | null;
  from_year: string | null;
  to_year: string | null;
  year_from: string | null;
  year_to: string | null;
  changePoint: string | null;
  code: string | null;
  mounting_time: string | null;
  equipment: string | null;
  subgroup: string | null;
} | null;

interface GroupInfoPopupProps {
  isActive: boolean;
  description: GroupInfoPopupDescription;
  onClose: () => void;
  position: { top: number; left: number };
  title: string;
}

const GroupInfoPopup: React.FC<GroupInfoPopupProps> = ({
  isActive,
  description,
  onClose,
  position,
  title,
}) => {
  const { t } = useTranslation();

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
          {description?.subgroup && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_subgroup}</p>
              <p className="info-popup__text">{description?.subgroup}</p>
            </div>
          )}
          {description?.code && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_code}</p>
              <p className="info-popup__text">{description?.code}</p>
            </div>
          )}
          {description?.referenceNr && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_reference}</p>
              <p className="info-popup__text">{description?.referenceNr}</p>
            </div>
          )}
          {description?.illustration && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_illustration}</p>
              <p className="info-popup__text">{description?.illustration}</p>
            </div>
          )}
          {description?.name && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_name}</p>
              <p className="info-popup__text">{description?.name}</p>
            </div>
          )}
          {description?.from && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_from}</p>
              <p className="info-popup__text">{description?.from}</p>
            </div>
          )}
          {description?.to && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_to}</p>
              <p className="info-popup__text">{description?.to}</p>
            </div>
          )}
          {description?.from_year && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_from}</p>
              <p className="info-popup__text">{description?.from_year}</p>
            </div>
          )}
          {description?.to_year && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_to}</p>
              <p className="info-popup__text">{description?.to_year}</p>
            </div>
          )}
          {description?.year_from && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_from}</p>
              <p className="info-popup__text">{description?.year_from}</p>
            </div>
          )}
          {description?.year_to && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_to}</p>
              <p className="info-popup__text">{description?.year_to}</p>
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
          {description?.mounting_time && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_mounting_time}</p>
              <p className="info-popup__text">{description?.mounting_time}</p>
            </div>
          )}
          {description?.equipment && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_equipment_2}</p>
              <p className="info-popup__text">{description?.equipment}</p>
            </div>
          )}
          {description?.description && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_comment}</p>
              <p className="info-popup__text">{description?.description}</p>
            </div>
          )}
          {description?.remark && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_remark}</p>
              <p className="info-popup__text">{description?.remark}</p>
            </div>
          )}
          {description?.comment && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_restriction}</p>
              <p className="info-popup__text">{description?.comment}</p>
            </div>
          )}
          {description?.restriction && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_restriction}</p>
              <p className="info-popup__text">{description?.restriction}</p>
            </div>
          )}
          {description?.modelDescription && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_model_desc}</p>
              <p className="info-popup__text">
                {description?.modelDescription}
              </p>
            </div>
          )}
          {description?.changePoint && (
            <div className="info-popup__container">
              <p className="info-popup__title">{t.widget_change_point}</p>
              <p className="info-popup__text">{description?.changePoint}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GroupInfoPopup;
