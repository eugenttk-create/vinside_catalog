import infoPopupStyles from "../InfoPopup/InfoPopup.module.css";
import shared from "../../styles/common.module.css";
import { X } from "lucide-react";
import { orderCatalogFields } from "../../utils/orderCatalogFields";
import { useTranslation } from "../../hooks/translation/useTranslation";
import formatDate from "../../utils/formatDate";

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

  const fields = orderCatalogFields(
    [
      { key: "subgroup", label: t.widget_subgroup, value: description?.subgroup },
      { key: "code", label: t.widget_code, value: description?.code },
      { key: "referenceNr", label: t.widget_reference, value: description?.referenceNr },
      { key: "illustration", label: t.widget_illustration, value: description?.illustration },
      { key: "name", label: t.widget_name, value: description?.name },
      { key: "from", label: t.widget_from, value: description?.from && formatDate(description.from) },
      { key: "to", label: t.widget_to, value: description?.to && formatDate(description.to) },
      { key: "from_year", label: t.widget_from, value: description?.from_year && formatDate(description.from_year) },
      { key: "to_year", label: t.widget_to, value: description?.to_year && formatDate(description.to_year) },
      { key: "year_from", label: t.widget_from, value: description?.year_from && formatDate(description.year_from) },
      { key: "year_to", label: t.widget_to, value: description?.year_to && formatDate(description.year_to) },
      { key: "pet", label: t.widget_pet, value: description?.pet },
      { key: "pat", label: t.widget_pat, value: description?.pat },
      { key: "mounting_time", label: t.widget_mounting_time, value: description?.mounting_time },
      { key: "equipment", label: t.widget_equipment_2, value: description?.equipment },
      { key: "description", label: t.widget_comment, value: description?.description },
      { key: "remark", label: t.widget_remark, value: description?.remark },
      { key: "comment", label: t.widget_restriction, value: description?.comment },
      { key: "restriction", label: t.widget_restriction, value: description?.restriction },
      { key: "modelDescription", label: t.widget_model_desc, value: description?.modelDescription },
      { key: "changePoint", label: t.widget_change_point, value: description?.changePoint },
    ],
    (field) => field.key
  ).filter((field) => field.value);

  return (
    <>
      <div
        className={`${infoPopupStyles["info-popup__overlay"]} ${isActive ? infoPopupStyles["info-popup__overlay_active"] : ""}`}
        onClick={onClose}
      ></div>
      <div
        className={`${infoPopupStyles["info-popup"]} ${isActive ? infoPopupStyles["info-popup_active"] : ""}`}
        style={{ top: position.top || "0", left: position.left || "0" }}
      >
        <button className={infoPopupStyles["info-popup__close"]} onClick={onClose}>
          <X className={shared["icon"]} />
        </button>
        <p className={infoPopupStyles["info-popup__top-title"]}>{title}</p>
        <div className={infoPopupStyles["info-popup__containers"]}>
          {fields.map((field) => (
            <div key={field.key} className={infoPopupStyles["info-popup__container"]}>
              <p className={infoPopupStyles["info-popup__title"]}>{field.label}</p>
              <p className={infoPopupStyles["info-popup__text"]}>{field.value}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupInfoPopup;
