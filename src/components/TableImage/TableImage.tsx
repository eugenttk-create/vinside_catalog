import { FALLBACK_IMAGE } from "../../utils/resolveImgSrc";
import { createPortal } from "react-dom";
import { useState, useRef } from "react";

const TableImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPreview({ x: rect.left, y: rect.top });
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
              width: 200,
              borderRadius: 8,
              zIndex: 999,
              pointerEvents: "none",
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          />,
          document.getElementById("catalog-root")!
        )}
    </>
  );
};

export default TableImage;
