import "./CatalogParts.css";
import { useEffect, useRef, useState } from "react";
import { useParts } from "../../../../hooks/parts/useParts";
import { useTranslation } from "../../../../hooks/translation/useTranslation";
import { resolveImageSrc } from "../../../../utils/resolveImgSrc";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";

import { useTableResize } from "../../../../hooks/parts/useTableResize";
import { useImageZoomPan } from "../../../../hooks/parts/useImageZoomPan";
import { useOverlaySync } from "../../../../hooks/parts/useOverlaySync";

import ZoomControls from "../../../ZoomControls/ZoomControls";
import MiniImages from "../../../MiniImages/MiniImages";
import ImageOverlay from "../../../ImageOverlay/ImageOverlay";
import PartsTable from "../../../PartsTable/PartsTable";

interface CatalogPartsProps {
  modelId: string;
  setModelId: React.Dispatch<React.SetStateAction<string>>;
}

const CatalogParts: React.FC<CatalogPartsProps> = ({ modelId, setModelId }) => {
  const { t } = useTranslation();
  const { parts } = useParts();

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const isMultiImg = Array.isArray(parts.img);
  const [activeImg, setActiveImg] = useState<string>(() =>
    Array.isArray(parts.img) ? parts.img[0] ?? "" : parts.img
  );
  const [hoverImgPos, setHoverImgPos] = useState<string | null>(null);
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [hoverTablePos, setHoverTablePos] = useState<string | null>(null);
  const [copiedPartId, setCopiedPartId] = useState<string | null>(null);

  const { tableWidth, startResize } = useTableResize(catalogRef);
  const { scale, panOffset, isPanning, zoomIn, zoomOut, resetZoom } =
    useImageZoomPan(containerRef);
  const { updateRects, computeOverlayStyle } = useOverlaySync(
    imageRef,
    containerRef,
    [parts.img]
  );

  useEffect(() => {
    setActiveImg(Array.isArray(parts.img) ? parts.img[0] ?? "" : parts.img);
  }, [parts.img]);

  useEffect(() => {
    const id = setTimeout(() => requestAnimationFrame(updateRects), 0);
    return () => clearTimeout(id);
  }, [tableWidth]);

  useEffect(() => {
    if (isPanning.current) {
      requestAnimationFrame(updateRects);
    } else {
      const id = setTimeout(() => requestAnimationFrame(updateRects), 110);
      return () => clearTimeout(id);
    }
  }, [scale, panOffset.x, panOffset.y]);

  const handleCopy = async (partId: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedPartId(partId);
      setTimeout(() => setCopiedPartId(null), 1500);
    } catch (e) {
      console.error("Copy error:", e);
    }
  };

  const scrollRowToCenter = (row: HTMLTableRowElement) => {
    const wrapper = row.closest(".catalog-parts__table-wrapper");
    if (!wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    const rRect = row.getBoundingClientRect();
    const target =
      rRect.top -
      wRect.top +
      wrapper.scrollTop -
      wrapper.clientHeight / 2 +
      row.clientHeight / 2;
    wrapper.scrollTo({
      top: Math.max(
        0,
        Math.min(wrapper.scrollHeight - wrapper.clientHeight, target)
      ),
      behavior: "smooth",
    });
  };

  const handleImgOverlaySelect = (key: string) => {
    setSelectedPos(key);

    const row = rowRefs.current[key];
    if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleRowClick = (posKey: string) => {
    setSelectedPos(posKey);
    if (isMultiImg) {
      const position = parts.positions.find((p) => String(p.number) === posKey);
      if (
        position?.img &&
        resolveImageSrc(position.img) !== resolveImageSrc(activeImg)
      ) {
        setActiveImg(position.img);
      }
    }
    const row = rowRefs.current[posKey];
    if (row) scrollRowToCenter(row);
  };

  const visiblePositions = parts.positions.filter(
    (p) =>
      !isMultiImg || resolveImageSrc(p.img ?? "") === resolveImageSrc(activeImg)
  );

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
          <ZoomControls
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetZoom}
          />

          {isMultiImg && (
            <MiniImages
              images={Array.isArray(parts.img) ? parts.img : []}
              activeImg={activeImg}
              onSelect={setActiveImg}
            />
          )}

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

          <ImageOverlay
            positions={visiblePositions as any}
            hoverImgPos={hoverImgPos}
            hoverTablePos={hoverTablePos}
            selectedPos={selectedPos}
            onHoverEnter={setHoverImgPos}
            onHoverLeave={() => setHoverImgPos(null)}
            onSelect={handleImgOverlaySelect}
            computeOverlayStyle={computeOverlayStyle}
          />
        </div>

        <PartsTable
          parts={parts.partGroups[0].parts}
          selectedPos={selectedPos}
          hoverTablePos={hoverTablePos}
          copiedPartId={copiedPartId}
          rowRefs={rowRefs}
          onRowHoverEnter={setHoverTablePos}
          onRowHoverLeave={() => setHoverTablePos(null)}
          onRowClick={handleRowClick}
          onCopy={handleCopy}
          onStartResize={startResize}
          tableWidth={tableWidth}
          t={t}
        />
      </div>
    </>
  );
};

export default CatalogParts;
