import { Copy, CircleCheck, Info } from "lucide-react";
import { getPartLink } from "../../utils/getPartLink";

interface Part {
  id: string;
  number: string;
  name: string;
  positionNumber?: string | number;
}

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
}) => (
  <div className="catalog-parts__table-wrapper" style={{ width: tableWidth }}>
    <div className="catalog-parts__resize-handle" onMouseDown={onStartResize}>
      <div className="catalog-parts__resize-icon" />
    </div>
    <table className="catalog-parts__table">
      <tbody className="catalog-parts__tbody">
        {parts.map((part) => {
          const posKey = part.positionNumber ? String(part.positionNumber) : "";
          return (
            <tr
              key={part.id}
              className={`catalog-parts__tr ${
                selectedPos === posKey || hoverTablePos === posKey
                  ? "catalog-parts__tr_active"
                  : ""
              }`}
              ref={(el) => {
                if (posKey) rowRefs.current[posKey] = el;
              }}
              onMouseEnter={() => posKey && onRowHoverEnter(posKey)}
              onMouseLeave={onRowHoverLeave}
              onClick={() => posKey && onRowClick(posKey)}
            >
              <td className="catalog-parts__td">
                <span className="catalog-parts__ts">{part.positionNumber}</span>
              </td>
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
              <td className="catalog-parts__td">
                <span className="catalog-parts__ts" title={part.name}>
                  <Info className="icon catalog-parts__icon" />{" "}
                  <span className="catalog-parts__ts_name">{part.name}</span>
                </span>
              </td>
              <td className="catalog-parts__td">
                <span className="catalog-parts__ts">
                  <button className="catalog-parts__tb button">
                    {t.widget_analogues_button}
                  </button>
                </span>
              </td>
              <td className="catalog-parts__td">
                <span className="catalog-parts__ts">
                  <button className="catalog-parts__tb button">
                    <a href={getPartLink(part.number)} target="_blank">
                      {t.widget_see_price_button}
                    </a>
                  </button>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default PartsTable;
