import catalogPartsStyles from "../Catalog/CatalogMain/CatalogParts/CatalogParts.module.css";
import shared from "../../styles/common.module.css";
import { Copy, CircleCheck, Info } from "lucide-react";
import { getPartLink } from "../../utils/getPartLink";
import { useState } from "react";
import type { Part } from "../../store/parts/parts.types";
import PartsInfoPopup from "../PartsInfoPopup/PartsInfoPopup";

interface PartsTableProps {
  parts: Part[];
  selectedPos: string | null;
  hoverTablePos: string | null;
  copiedPartId: string | null;
  rowRefs: React.MutableRefObject<{
    [key: string]: HTMLTableRowElement | null;
  }>;
  onRowHoverEnter: (key: string) => void;
  onRowHoverLeave: () => void;
  onRowClick: (posKey: string) => void;
  onCopy: (id: string, value: string) => void;
  onStartResize: () => void;
  tableWidth: number;
  t: Record<string, string>;
  onAnaloguesClick?: (partNumber: string) => void;
}

const PartsTable: React.FC<PartsTableProps> = ({
  parts,
  selectedPos,
  hoverTablePos,
  copiedPartId,
  rowRefs,
  onRowHoverEnter,
  onRowHoverLeave,
  onRowClick,
  onCopy,
  onStartResize,
  tableWidth,
  t,
  onAnaloguesClick,
}) => {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const handleInfoClick = (e: React.MouseEvent, part: Part) => {
    e.stopPropagation();
    setSelectedPart(part);
    setIsInfoPopupOpen(true);
  };

  const handleAnaloguesClick = (e: React.MouseEvent, partNumber: string) => {
    e.stopPropagation();
    onAnaloguesClick?.(partNumber);
  };

  return (
    <div className={catalogPartsStyles["catalog-parts__table-wrapper"]} style={{ width: tableWidth }}>
      <div
        className={catalogPartsStyles["catalog-parts__resize-handle"]}
        onMouseDown={onStartResize}
      ></div>
      <table className={catalogPartsStyles["catalog-parts__table"]}>
        <tbody className={shared["catalog-parts__tbody"]}>
          {parts.length === 0 ? (
            <tr className={`${catalogPartsStyles["catalog-parts__tr"]} ${shared["catalog-parts__tr_empty"]}`}>
              <td className={catalogPartsStyles["catalog-parts__td"]} colSpan={5}>
                <span className={`${catalogPartsStyles["catalog-parts__ts"]} ${shared["catalog-parts__ts_empty"]}`}>
                  {t.widget_no_data ?? "Нет данных"}
                </span>
              </td>
            </tr>
          ) : (
            parts.map((part) => {
              const posKey = part.positionNumber
                ? String(part.positionNumber)
                : "";
              return (
                <tr
                  key={part.id}
                  className={`${catalogPartsStyles["catalog-parts__tr"]} ${selectedPos === posKey || hoverTablePos === posKey ? catalogPartsStyles["catalog-parts__tr_active"] : ""} ${selectedPart?.id === part.id ? catalogPartsStyles["catalog-parts__tr_info-active"] : ""}`}
                  ref={(el) => {
                    if (posKey) rowRefs.current[posKey] = el;
                  }}
                  onMouseEnter={() => posKey && onRowHoverEnter(posKey)}
                  onMouseLeave={onRowHoverLeave}
                  onClick={() => posKey && onRowClick(posKey)}
                >
                  <td className={catalogPartsStyles["catalog-parts__td"]}>
                    <span className={catalogPartsStyles["catalog-parts__ts"]}>
                      {part.positionNumber}
                    </span>
                  </td>
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
                  <td className={catalogPartsStyles["catalog-parts__td"]}>
                    <span className={catalogPartsStyles["catalog-parts__ts"]} title={part.name}>
                      <Info
                        className={`${shared["icon"]} ${catalogPartsStyles["catalog-parts__icon"]}`}
                        onClick={(e) => handleInfoClick(e, part)}
                      />{" "}
                      <span className={catalogPartsStyles["catalog-parts__ts_name"]}>
                        {part.name}
                      </span>
                    </span>
                  </td>
                  <td className={catalogPartsStyles["catalog-parts__td"]}>
                    <span className={catalogPartsStyles["catalog-parts__ts"]}>
                      <button
                        className={`${catalogPartsStyles["catalog-parts__tb"]} ${shared["button"]}`}
                        onClick={(e) => handleAnaloguesClick(e, part.number)}
                      >
                        {t.widget_analogues_button}
                      </button>
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {isInfoPopupOpen && (
        <PartsInfoPopup
          isActive={isInfoPopupOpen}
          setIsActive={setIsInfoPopupOpen}
          part={selectedPart}
          onCopy={onCopy}
          copiedPartId={copiedPartId}
        />
      )}
    </div>
  );
};

export default PartsTable;
