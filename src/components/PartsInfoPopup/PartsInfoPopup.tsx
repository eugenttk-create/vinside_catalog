import "./PartsInfoPopup.css";
import { useTranslation } from "../../hooks/translation/useTranslation";
import type { Part, PartDescriptionKey } from "../../store/parts/parts.types";
import { PART_DESCRIPTION_KEYS } from "../../store/parts/parts.types";
import { X, CircleCheck, Copy } from "lucide-react";
import CatalogGroupsTableHead from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableHead/CatalogGroupsTableHead";
import CatalogGroupsTableRow from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableRow/CatalogGroupsTableRow";
import { getPartLink } from "../../utils/getPartLink";

interface PartsInfoPopupProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  part: Part | null;
  copiedPartId: string | null;
  onCopy: (id: string, value: string) => void;
}

const PartsInfoPopup: React.FC<PartsInfoPopupProps> = ({
  isActive,
  setIsActive,
  part,
  copiedPartId,
  onCopy,
}) => {
  const { t } = useTranslation();

  const columnLabels: Record<PartDescriptionKey, string> = {
    positionNumber: t.widget_position_number,
    number: t.widget_number,
    name: t.widget_name,
    remark: t.widget_remark,
    qty: t.widget_qty,
    modelDescription: t.widget_model_desc,
    modelNumber: t.widget_model_number,
    me: t.widget_me,
    ae: t.widget_ae,
    pet: t.widget_pet,
    pat: t.widget_pat,
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

  // const activeColumns = PART_DESCRIPTION_KEYS.filter((key) => {
  //   const val = part?.description?.[key];
  //   return typeof val === "string" && val.trim() !== "";
  // });

  // const activeColumns = PART_DESCRIPTION_KEYS;

  const activeColumns = PART_DESCRIPTION_KEYS.filter(
    (key) => key in (part?.description ?? {})
  );
  console.log(part);
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
        <div className="table-container table-container_parts">
          <X
            className="parts-popup__close"
            onClick={() => setIsActive(false)}
          />
          <div className="table-wrapper table-wrapper_parts">
            <table className="table table_parts">
              <thead className="table-header">
                <tr className="table-row">
                  <CatalogGroupsTableHead title={t.widget_number} />
                  <CatalogGroupsTableHead title={t.widget_name} />{" "}
                  <CatalogGroupsTableHead title={t.widget_see_price_button} />
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
                  <td className="catalog-parts__td">
                    <span
                      className={
                        "catalog-parts__ts catalog-parts__ts_number" +
                        (copiedPartId === part.id
                          ? " catalog-parts__ts_number-copied"
                          : "")
                      }
                      onClick={() => onCopy(part.id, part.number)}
                      style={{ cursor: "pointer" }}
                    >
                      {part.number}{" "}
                      {copiedPartId === part.id ? (
                        <CircleCheck className="icon catalog-parts__table-icon catalog-parts__table-icon_copied" />
                      ) : (
                        <Copy className="icon catalog-parts__table-icon" />
                      )}
                    </span>
                  </td>
                  <CatalogGroupsTableRow text={part.name ? part.name : "-"} />
                  <td className="catalog-parts__td">
                    <span className="catalog-parts__ts">
                      <button className="catalog-parts__tb button">
                        <a href={getPartLink(part.number)} target="_blank">
                          {t.widget_see_price_button}
                        </a>
                      </button>
                    </span>
                  </td>
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
