import "./CatalogParts.css";
import { Copy } from "lucide-react";
import { useParts } from "../../../../hooks/parts/useParts";
import { useEffect, useState, useRef } from "react";
import GroupBreadcrumbs from "../../Breadcrumbs/GroupBreadcrumbs/GroupBreadcrumbs";

const IMAGE_URL = import.meta.env.VITE_API_IMG_BASE;

const CatalogParts: React.FC = () => {
  const { parts } = useParts();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imgRect, setImgRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const [hoverPos, setHoverPos] = useState<string | null>(null);

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
      <GroupBreadcrumbs />
      <div className="catalog-parts">
        <div
          className="catalog-parts__img-container"
          ref={containerRef}
          style={{ position: "relative" }}
        >
          <img
            ref={imageRef}
            src={`${IMAGE_URL}${parts.img}`}
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

            const handleClick = () => {
              const row = rowRefs.current[key];
              if (row) {
                row.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            };

            return (
              <div
                key={key}
                style={baseStyle}
                onMouseEnter={() => setHoverPos(key)}
                onMouseLeave={() => setHoverPos(null)}
                onClick={handleClick}
                className={`catalog-parts__highlight ${
                  hoverPos === key ? "catalog-parts__highlight_active" : ""
                }`}
              />
            );
          })}
        </div>

        <div className="catalog-parts__table-wrapper">
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
                        hoverPos === posKey ? "catalog-parts__tr_active" : ""
                      }`}
                      ref={(el) => {
                        if (posKey) rowRefs.current[posKey] = el;
                      }}
                      key={part.id}
                      onMouseEnter={() => posKey && setHoverPos(posKey)}
                      onMouseLeave={() => posKey && setHoverPos(null)}
                    >
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts">
                          {part.positionNumber}
                        </span>
                      </td>
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts catalog-parts__ts_number">
                          {part.number}{" "}
                          <Copy className="icon catalog-parts__table-icon" />
                        </span>
                      </td>
                      <td className="catalog-parts__td">
                        <span className="catalog-parts__ts">{part.name}</span>
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
