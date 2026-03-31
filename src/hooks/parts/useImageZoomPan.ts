import { useEffect, useRef, useState } from "react";
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from "../../utils/constants";

export const useImageZoomPan = (
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;

      setScale((prev) => {
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta));
        if (newScale !== prev) {
          const ratio = newScale / prev;
          setPanOffset((p) => ({
            x: mouseX - (mouseX - p.x) * ratio,
            y: mouseY - (mouseY - p.y) * ratio,
          }));
        }
        return newScale;
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [containerRef]);

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
      setPanOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
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
  }, [scale, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getDist = (touches: TouchList) => {
      if (touches.length < 2) return null;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getCenter = (touches: TouchList) => ({
      x:
        Array.from(touches).reduce((s, t) => s + t.clientX, 0) / touches.length,
      y:
        Array.from(touches).reduce((s, t) => s + t.clientY, 0) / touches.length,
    });

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDistance.current = getDist(e.touches);
      } else if (e.touches.length === 1) {
        lastPanPoint.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();
        const dist = getDist(e.touches);
        if (!dist) return;
        const rect = container.getBoundingClientRect();
        const center = getCenter(e.touches);
        const cx = center.x - rect.left;
        const cy = center.y - rect.top;
        const scaleChange = dist / lastTouchDistance.current;

        setScale((prev) => {
          const newScale = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, prev * scaleChange)
          );
          if (newScale !== prev) {
            const ratio = newScale / prev;
            setPanOffset((p) => ({
              x: cx - (cx - p.x) * ratio,
              y: cy - (cy - p.y) * ratio,
            }));
          }
          return newScale;
        });

        lastTouchDistance.current = dist;
      } else if (e.touches.length === 1 && scale > 1) {
        e.preventDefault();
        const t = e.touches[0];
        setPanOffset((p) => ({
          x: p.x + t.clientX - lastPanPoint.current.x,
          y: p.y + t.clientY - lastPanPoint.current.y,
        }));
        lastPanPoint.current = { x: t.clientX, y: t.clientY };
      }
    };

    const onTouchEnd = () => {
      lastTouchDistance.current = null;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [scale, containerRef]);

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP));
  const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP));
  const resetZoom = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return { scale, panOffset, isPanning, zoomIn, zoomOut, resetZoom };
};
