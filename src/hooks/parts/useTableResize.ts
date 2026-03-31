import { useEffect, useRef, useState } from "react";
import { LS_KEY, MIN_WIDTH, MAX_WIDTH } from "../../utils/constants";

export const useTableResize = (
  catalogRef: React.RefObject<HTMLDivElement | null>
) => {
  const [tableWidth, setTableWidth] = useState<number>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? Number(saved) : 400;
  });
  const isResizing = useRef(false);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !catalogRef.current) return;
      const rect = catalogRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      setTableWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)));
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
  }, [tableWidth, catalogRef]);

  return { tableWidth, startResize };
};
