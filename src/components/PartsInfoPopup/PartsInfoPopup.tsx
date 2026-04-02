import "./PartsInfoPopup.css";
import { useTranslation } from "../../hooks/translation/useTranslation";
import type { Part, PartDescriptionKey } from "../../store/parts/parts.types";
import { PART_DESCRIPTION_KEYS } from "../../store/parts/parts.types";
import { X } from "lucide-react";
import CatalogGroupsTableHead from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableHead/CatalogGroupsTableHead";
import CatalogGroupsTableRow from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableRow/CatalogGroupsTableRow";

interface PartsInfoPopupProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  part: Part | null;
}

const PartsInfoPopup: React.FC<PartsInfoPopupProps> = ({
  isActive,
  setIsActive,
  part,
}) => {
  const { t } = useTranslation();

  const columnLabels: Record<PartDescriptionKey, string> = {
    positionNumber: t.widget_position_number,
    number: t.widget_number,
    name: t.widget_name,
    remark: t.widget_remark,
    qty: t.widget_qty,
    modelDescription: t.widget_model_desc,
    me: t.widget_me,
    ae: t.widget_ae,
    year_from: t.widget_from,
    year_to: t.widget_to,
    to_year: t.widget_to,
    from_year: t.widget_from,
    to: t.widget_to,
    from: t.widget_from,
    info: t.widget_info,
    color: t.widget_color,
    restriction: t.widget_restriction,
    properties: t.widget_properties,
    optional: t.widget_optional,
    appliNote: t.widget_appli_note,
    hint: t.widget_hint,
    modificationCodes: t.widget_modification_codes,
    comment: t.widget_comment,
  };

  const activeColumns = PART_DESCRIPTION_KEYS.filter((key) => {
    const val = part?.description?.[key];
    return typeof val === "string" && val.trim() !== "";
  });

  if (!isActive || !part) return null;

  return (
    <div
      className={`parts-popup ${isActive ? "parts-popup_active" : ""}`}
      onClick={() => setIsActive(false)}
    >
      <div
        className="parts-popup__content"
        onClick={(e) => e.stopPropagation()}
      >
        <X className="parts-popup__close" onClick={() => setIsActive(false)} />
        <div className="table-container">
          <div className="table-wrapper">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  {activeColumns.map((key) => (
                    <CatalogGroupsTableHead
                      key={key}
                      title={columnLabels[key]}
                    />
                  ))}
                </tr>
              </thead>
              <tbody className="table-body">
                <tr className="table-row">
                  {activeColumns.map((key) => (
                    <CatalogGroupsTableRow
                      key={key}
                      text={part.description?.[key] ?? "—"}
                    />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartsInfoPopup;
