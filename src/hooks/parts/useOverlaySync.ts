import { useCallback, useEffect, useState } from "react";

export const useOverlaySync = (
  imageRef: React.RefObject<HTMLImageElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  deps: unknown[] = []
) => {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [imgRect, setImgRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

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
  }, [imageRef, containerRef]);

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;
    const onLoad = () => requestAnimationFrame(updateRects);
    img.addEventListener("load", onLoad);
    const ro = new ResizeObserver(updateRects);
    ro.observe(img);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateRects);
    if (img.complete) updateRects();
    return () => {
      img.removeEventListener("load", onLoad);
      ro.disconnect();
      window.removeEventListener("resize", updateRects);
    };
  }, [imageRef, containerRef, updateRects, ...deps]);

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
    return {
      left: offsetLeft + x * sx,
      top: offsetTop + y * sy,
      width: Math.max(0, w * sx),
      height: Math.max(0, h * sy),
    };
  };

  return { updateRects, computeOverlayStyle };
};
