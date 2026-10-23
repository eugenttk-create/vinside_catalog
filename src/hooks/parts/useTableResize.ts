import { useCallback, useEffect, useRef, useState } from "react";
import { LS_KEY, MIN_WIDTH, MAX_WIDTH } from "../../utils/constants";

export const useTableResize = (
  catalogRef: React.RefObject<HTMLDivElement | null>
) => {
  const [tableWidth, setTableWidth] = useState<number>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? Number(saved) : 400;
  });
  const isResizing = useRef(false);
  const savedBodyStyle = useRef({ cursor: "", cursorPriority: "", userSelect: "", userSelectPriority: "" });

  const restoreBodyStyle = useCallback(() => {
    document.body.style.setProperty("cursor", savedBodyStyle.current.cursor, savedBodyStyle.current.cursorPriority);
    document.body.style.setProperty("user-select", savedBodyStyle.current.userSelect, savedBodyStyle.current.userSelectPriority);
  }, []);

  const startResize = () => {
    if (!isResizing.current) {
      savedBodyStyle.current = {
        cursor: document.body.style.cursor,
        cursorPriority: document.body.style.getPropertyPriority("cursor"),
        userSelect: document.body.style.userSelect,
        userSelectPriority: document.body.style.getPropertyPriority("user-select"),
      };
    }
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
      restoreBodyStyle();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [tableWidth, catalogRef, restoreBodyStyle]);

  useEffect(() => () => {
    if (isResizing.current) restoreBodyStyle();
  }, [restoreBodyStyle]);

  return { tableWidth, startResize };
};
