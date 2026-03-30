import "./CatalogParts.css";
import { Copy, CircleCheck, Info } from "lucide-react";
import { useParts } from "../../../../hooks/parts/useParts";
import { useEffect, useState, useRef, useCallback } from "react";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import { resolveImageSrc } from "../../../../utils/resolveImgSrc";
import { useTranslation } from "../../../../hooks/translation/useTranslation";

const MIN_WIDTH = 300;
const MAX_WIDTH = 1500;
const LS_KEY = "catalog_parts_table_width";
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.1;

const baseLink = window.__WIDGET_LINK__;

interface CatalogPartsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogParts: React.FC<CatalogPartsProps> = ({ modelId, setModelId }) => {
  const { t } = useTranslation();
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

  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const isMultiImg = Array.isArray(parts.img);
  const [activeImg, setActiveImg] = useState<string>(() =>
    Array.isArray(parts.img) ? parts.img[0] ?? "" : parts.img
  );

  const [tableWidth, setTableWidth] = useState<number>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? Number(saved) : 400;
  });

  const isResizing = useRef(false);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveImg(Array.isArray(parts.img) ? parts.img[0] ?? "" : parts.img);
  }, [parts.img]);

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

  const updateRects = useCallback(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    setNaturalSize({
      width: img.naturalWidth || 0,
      height: img.naturalHeight || 0,
    });

    setImgRect(img.getBoundingClientRect());
    setContainerRect(container.getBoundingClientRect());
  }, []);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta));

      if (newScale !== scale) {
        const scaleRatio = newScale / scale;
        setPanOffset({
          x: mouseX - (mouseX - panOffset.x) * scaleRatio,
          y: mouseY - (mouseY - panOffset.y) * scaleRatio,
        });
        setScale(newScale);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [scale, panOffset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".catalog-parts__highlight"))
        return;

      isPanning.current = true;
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;

      const dx = e.clientX - lastPanPoint.current.x;
      const dy = e.clientY - lastPanPoint.current.y;

      setPanOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      container.style.cursor = scale > 1 ? "grab" : "default";
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return null;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (touches: TouchList) => {
      if (touches.length === 0) return { x: 0, y: 0 };
      const x =
        Array.from(touches).reduce((sum, t) => sum + t.clientX, 0) /
        touches.length;
      const y =
        Array.from(touches).reduce((sum, t) => sum + t.clientY, 0) /
        touches.length;
      return { x, y };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistance.current = getTouchDistance(e.touches);
      } else if (e.touches.length === 1) {
        const touch = e.touches[0];
        lastPanPoint.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();

        const currentDistance = getTouchDistance(e.touches);
        if (currentDistance === null) return;

        const rect = container.getBoundingClientRect();
        const center = getTouchCenter(e.touches);
        const centerX = center.x - rect.left;
        const centerY = center.y - rect.top;

        const scaleChange = currentDistance / lastTouchDistance.current;
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, scale * scaleChange)
        );

        if (newScale !== scale) {
          const scaleRatio = newScale / scale;
          setPanOffset({
            x: centerX - (centerX - panOffset.x) * scaleRatio,
            y: centerY - (centerY - panOffset.y) * scaleRatio,
          });
          setScale(newScale);
        }

        lastTouchDistance.current = currentDistance;
      } else if (e.touches.length === 1 && scale > 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - lastPanPoint.current.x;
        const dy = touch.clientY - lastPanPoint.current.y;

        setPanOffset((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));

        lastPanPoint.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistance.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale, panOffset]);

  const handleZoomIn = () => {
    const newScale = Math.min(MAX_SCALE, scale + SCALE_STEP);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(MIN_SCALE, scale - SCALE_STEP);
    setScale(newScale);
  };

  const handleResetZoom = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(updateRects);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [tableWidth]);

  useEffect(() => {
    if (isPanning.current) {
      requestAnimationFrame(updateRects);
    } else {
      const timeout = setTimeout(() => {
        requestAnimationFrame(updateRects);
      }, 110);
      return () => clearTimeout(timeout);
    }
  }, [scale, panOffset.x, panOffset.y]);

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
    return { left, top, width, height };
  };

  const scrollRowToCenter = (row: HTMLTableRowElement) => {
    const container = row.closest(".catalog-parts__table-wrapper");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();

    const containerScrollTop = container.scrollTop;

    const rowOffsetTop = rowRect.top - containerRect.top + containerScrollTop;

    const targetScroll =
      rowOffsetTop - container.clientHeight / 2 + row.clientHeight / 2;

    const maxScroll = container.scrollHeight - container.clientHeight;

    const clampedScroll = Math.max(0, Math.min(maxScroll, targetScroll));

    container.scrollTo({
      top: clampedScroll,
      behavior: "smooth",
    });
  };

  const getPartLink = (partNumber: string) => {
    if (!baseLink) {
      return `https://google.com/search?q=${partNumber}`;
    }

    return baseLink.replace("{part}", partNumber);
  };

  return (
    <>
      <Breadcrumbs modelId={modelId} setModelId={setModelId} />
      <div className="catalog-parts" ref={catalogRef}>
        <div
          className="catalog-parts__img-container"
          ref={containerRef}
          style={{
            position: "relative",
            overflow: "hidden",
            cursor: scale > 1 ? "grab" : "default",
          }}
        >
          <div className="catalog-parts__zoom-controls">
            <button
              className="catalog-parts__zoom-btn"
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
            >
              −
            </button>
            <span
              className="catalog-parts__zoom-value"
              onClick={handleResetZoom}
              style={{ cursor: "pointer" }}
              title="Сбросить масштаб"
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              className="catalog-parts__zoom-btn"
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
            >
              +
            </button>
          </div>

          <img
            ref={imageRef}
            src={resolveImageSrc(activeImg)}
            alt="parts"
            className="catalog-parts__image"
            draggable={false}
            loading="lazy"
            style={{
              transform: `scale(${scale}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: "0 0",
              transition: isPanning.current
                ? "none"
                : "transform 0.1s ease-out",
            }}
          />

          {parts.positions
            .filter((p) => {
              if (!isMultiImg) return true;
              return (
                resolveImageSrc(p.img ?? "") === resolveImageSrc(activeImg)
              );
            })
            .map((p) => {
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
                      row.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
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
          <div
            className="catalog-parts__resize-handle"
            onMouseDown={() => {
              isResizing.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          >
            <div className="catalog-parts__resize-icon"></div>
          </div>
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
                      onClick={() => {
                        if (!posKey) return;
                        setSelectedPos(posKey);

                        if (isMultiImg) {
                          const position = parts.positions.find(
                            (p) => String(p.number) === posKey
                          );
                          if (position?.img) {
                            if (
                              resolveImageSrc(position.img) !==
                              resolveImageSrc(activeImg)
                            ) {
                              setActiveImg(position.img);
                            }
                          }
                        }

                        const row = rowRefs.current[posKey];
                        if (row) scrollRowToCenter(row);
                      }}
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
      </div>
    </>
  );
};

export default CatalogParts;
