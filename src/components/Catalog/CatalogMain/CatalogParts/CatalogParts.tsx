import "./CatalogParts.css";
import { Copy, CircleCheck, Info } from "lucide-react";
import { useParts } from "../../../../hooks/parts/useParts";
import { useEffect, useState, useRef } from "react";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import { resolveImageSrc } from "../../../../utils/resolveImgSrc";

const MIN_WIDTH = 300;
const MAX_WIDTH = 1500;
const LS_KEY = "catalog_parts_table_width";

interface CatalogPartsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogParts: React.FC<CatalogPartsProps> = ({ modelId, setModelId }) => {
  const { parts } = useParts();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imgRect, setImgRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const [hoverImgPos, setHoverImgPos] = useState<string | null>(null);
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [hoverTablePos, setHoverTablePos] = useState<string | null>(null);
  const [copiedPartId, setCopiedPartId] = useState<string | null>(null);

  const [tableWidth, setTableWidth] = useState<number>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? Number(saved) : 400;
  });

  const isResizing = useRef(false);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !catalogRef.current) return;

      const rect = catalogRef.current.getBoundingClientRect();
      const containerRight = rect.right;

      const newWidth = containerRight - e.clientX;

      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth));

      setTableWidth(clamped);
    };

    const handleMouseUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      localStorage.setItem(LS_KEY, String(tableWidth));
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [tableWidth]);

  const updateRects = () => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    setNaturalSize({
      width: img.naturalWidth || 0,
      height: img.naturalHeight || 0,
    });

    setImgRect(img.getBoundingClientRect());
    setContainerRect(container.getBoundingClientRect());
  };

  const handleCopy = async (partId: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedPartId(partId);
      setTimeout(() => setCopiedPartId(null), 1500);
    } catch (e) {
      console.error("Copy error:", e);
    }
  };

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const onLoad = () => requestAnimationFrame(updateRects);

    img.addEventListener("load", onLoad);

    const ro = new ResizeObserver(() => {
      updateRects();
    });
    ro.observe(img);
    if (containerRef.current) ro.observe(containerRef.current);

    const onWin = () => updateRects();
    window.addEventListener("resize", onWin);

    if (img.complete) updateRects();

    return () => {
      img.removeEventListener("load", onLoad);
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, [parts.img]);

  const computeOverlayStyle = (coords: [number, number, number, number]) => {
    const [x, y, w, h] = coords;
    if (
      !imgRect ||
      !containerRect ||
      !naturalSize.width ||
      !naturalSize.height
    ) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    const sx = imgRect.width / naturalSize.width;
    const sy = imgRect.height / naturalSize.height;

    const offsetLeft = imgRect.left - containerRect.left;
    const offsetTop = imgRect.top - containerRect.top;

    const left = offsetLeft + x * sx;
    const top = offsetTop + y * sy;
    const width = Math.max(0, w * sx);
    const height = Math.max(0, h * sy);

    return {
      left,
      top,
      width,
      height,
    };
  };

  return (
    <>
      <Breadcrumbs modelId={modelId} setModelId={setModelId} />
      <div className="catalog-parts" ref={catalogRef}>
        <div
          className="catalog-parts__img-container"
          ref={containerRef}
          style={{ position: "relative" }}
        >
          <img
            ref={imageRef}
            src={resolveImageSrc(parts.img)}
            alt="parts"
            className="catalog-parts__image"
            loading="lazy"
          />

          {parts.positions.map((p) => {
            const key = String(p.number);
            const { left, top, width, height } = computeOverlayStyle(
              p.coordinates as [number, number, number, number]
            );

            const baseStyle: React.CSSProperties = {
              left,
              top,
              width,
              height,
            };

            return (
              <div
                key={key}
                style={baseStyle}
                onMouseEnter={() => setHoverImgPos(key)}
                onMouseLeave={() => setHoverImgPos(null)}
                onClick={() => {
                  setSelectedPos(key);
                  const row = rowRefs.current[key];
                  if (row) {
                    row.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className={`catalog-parts__highlight ${
                  hoverImgPos === key || hoverTablePos === key
                    ? "catalog-parts__highlight_active"
                    : ""
                }`}
              />
            );
          })}
        </div>

        <div
          className="catalog-parts__table-wrapper"
          style={{ width: tableWidth }}
        >
          {" "}
          <div
            className="catalog-parts__resize-handle"
            onMouseDown={() => {
              isResizing.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          />
          <table className="catalog-parts__table">
            <tbody className="catalog-parts__tbody">
              {parts &&
                parts.partGroups[0].parts.map((part) => {
                  const posKey = part.positionNumber
                    ? String(part.positionNumber)
                    : "";
                  return (
                    <tr
                      className={`catalog-parts__tr ${
                        selectedPos === posKey || hoverTablePos === posKey
                          ? "catalog-parts__tr_active"
                          : ""
                      }`}
                      ref={(el) => {
                        if (posKey) rowRefs.current[posKey] = el;
                      }}
                      key={part.id}
                      onMouseEnter={() => posKey && setHoverTablePos(posKey)}
                      onMouseLeave={() => setHoverTablePos(null)}
                      onClick={() => posKey && setSelectedPos(posKey)}
                    >
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts">
                          {part.positionNumber}
                        </span>
                      </td>
                      <td className="catalog-parts__td">
                        <span
                          className={
                            "catalog-parts__ts catalog-parts__ts_number" +
                            (copiedPartId === part.id
                              ? " catalog-parts__ts_number-copied"
                              : "")
                          }
                          onClick={() => handleCopy(part.id, part.number)}
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
                          <span className="catalog-parts__ts_name">
                            {part.name}
                          </span>
                        </span>
                      </td>
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts">
                          <button className="catalog-parts__tb button">
                            Аналоги
                          </button>
                        </span>
                      </td>
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts">
                          <button className="catalog-parts__tb button">
                            <a
                              href={`https://google.com/search?q=${part.number}`}
                              target="_blank"
                            >
                              Zobacz cenę
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
      </div>
    </>
  );
};

export default CatalogParts;
