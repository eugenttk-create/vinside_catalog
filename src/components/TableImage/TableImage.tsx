import { FALLBACK_IMAGE } from "../../utils/resolveImgSrc";
import { createPortal } from "react-dom";
import { useState, useRef } from "react";

function getPortalTarget(): HTMLElement {
  const portalEl = document.getElementById("widget-catalog-portal");
  if (portalEl) return portalEl;
  return document.body;
}

const TableImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const previewWidth = 220;
    const margin = 12;
    let x = rect.right + margin;
    let y = rect.top;

    if (x + previewWidth > window.innerWidth - margin) {
      x = rect.left - previewWidth - margin;
    }
    if (x < margin) {
      x = margin;
    }
    if (y + previewWidth > window.innerHeight - margin) {
      y = window.innerHeight - previewWidth - margin;
    }
    if (y < margin) {
      y = margin;
    }

    setPreview({ x, y });
  };

  const handleMouseLeave = () => setPreview(null);

  const cachedSrc = imgRef.current?.currentSrc || src;

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="table-image"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      {preview &&
        createPortal(
          <img
            src={cachedSrc}
            alt={alt}
            style={{
              position: "fixed",
              top: preview.y,
              left: preview.x,
              width: 220,
              maxHeight: 220,
              objectFit: "contain",
              borderRadius: 8,
              zIndex: 2147483647,
              pointerEvents: "none",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
              background: "#fff",
            }}
          />,
          getPortalTarget()
        )}
    </>
  );
};

export default TableImage;
