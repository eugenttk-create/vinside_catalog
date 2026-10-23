import styles from "./PartsInfoPopup.module.css";
import shared from "../../styles/common.module.css";
import catalogPartsStyles from "../Catalog/CatalogMain/CatalogParts/CatalogParts.module.css";
import { useTranslation } from "../../hooks/translation/useTranslation";
import type { Part, PartDescriptionKey } from "../../store/parts/parts.types";
import { PART_DESCRIPTION_KEYS } from "../../store/parts/parts.types";
import { X, CircleCheck, Copy } from "lucide-react";
import CatalogGroupsTableHead from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableHead/CatalogGroupsTableHead";
//import CatalogGroupsTableRow from "../Catalog/CatalogMain/CatalogGroups/CatalogGroupsTable/CatalogGroupsTableRow/CatalogGroupsTableRow";
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

  if (!isActive || !part) return null;

  return (
    <div
      className={`${styles["parts-popup"]} ${isActive ? styles["parts-popup_active"] : ""}`}
      onClick={() => setIsActive(false)}
    >
      <div
        className={styles["parts-popup__content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${shared["table-container"]} ${shared["table-container_parts"]}`}>
          <X
            className={styles["parts-popup__close"]}
            onClick={() => setIsActive(false)}
          />
          <div className={`${shared["table-wrapper"]} ${shared["table-wrapper_parts"]}`}>
            <table className={`${shared["table"]} ${shared["table_parts"]}`}>
              <thead className={shared["table-header"]}>
                <tr className={shared["table-row"]}>
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
              <tbody className={shared["table-body"]}>
                <tr className={shared["table-row"]}>
                  <td className={catalogPartsStyles["catalog-parts__td"]}>
                    <span
                      className={`${catalogPartsStyles["catalog-parts__ts"]} ${catalogPartsStyles["catalog-parts__ts_number"]}` + (copiedPartId === part.id ? ` ${catalogPartsStyles["catalog-parts__ts_number-copied"]}` : "")}
                      onClick={() => onCopy(part.id, part.number)}
                      style={{ cursor: "pointer" }}
                    >
                      {part.number}{" "}
                      {copiedPartId === part.id ? (
                        <CircleCheck className={`${shared["icon"]} ${catalogPartsStyles["catalog-parts__table-icon"]} ${catalogPartsStyles["catalog-parts__table-icon_copied"]}`} />
                      ) : (
                        <Copy className={`${shared["icon"]} ${catalogPartsStyles["catalog-parts__table-icon"]}`} />
                      )}
                    </span>
                  </td>
                  <td className={`${shared["table-data"]} ${shared["table-data_parts"]}`}>
                    <span className={shared["table-data-text"]}>
                      {part.name ? part.name : "-"}
                    </span>
                  </td>
                  <td className={catalogPartsStyles["catalog-parts__td"]}>
                    <span className={catalogPartsStyles["catalog-parts__ts"]}>
                      <button className={`${catalogPartsStyles["catalog-parts__tb"]} ${shared["button"]}`}>
                        <a href={getPartLink(part.number)} target="_blank">
                          {t.widget_see_price_button}
                        </a>
                      </button>
                    </span>
                  </td>
                  {activeColumns.map((key) => (
                    <td className={`${shared["table-data"]} ${shared["table-data_parts"]}`} key={key}>
                      <span className={shared["table-data-text"]}>
                        {part.description?.[key] ?? "—"}
                      </span>
                    </td>
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
