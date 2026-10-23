import { useEffect } from "react";
import catalogStyles from "../../components/Catalog/Catalog.module.css";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";
let savedOverflowPriority = "";
let savedPaddingPriority = "";

const preventTouch = (e: TouchEvent) => {
  if (!(e.target as Element)?.closest(`.${catalogStyles.catalog}`)) {
    e.preventDefault();
  }
};

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;

    if (lockCount === 0) {
      savedOverflow = body.style.overflow;
      savedPaddingRight = body.style.paddingRight;
      savedOverflowPriority = body.style.getPropertyPriority("overflow");
      savedPaddingPriority = body.style.getPropertyPriority("padding-right");

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        body.style.paddingRight = `${scrollBarWidth}px`;
      }
      body.style.overflow = "hidden";

      document.addEventListener("touchmove", preventTouch, { passive: false });
    }

    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        body.style.setProperty("overflow", savedOverflow, savedOverflowPriority);
        body.style.setProperty("padding-right", savedPaddingRight, savedPaddingPriority);
        document.removeEventListener("touchmove", preventTouch);
      }
    };
  }, [locked]);
}
