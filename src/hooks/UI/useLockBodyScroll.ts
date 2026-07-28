import { useEffect } from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

const preventTouch = (e: TouchEvent) => {
  if (!(e.target as Element)?.closest(".catalog")) {
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
        body.style.overflow = savedOverflow;
        body.style.paddingRight = savedPaddingRight;
        document.removeEventListener("touchmove", preventTouch);
      }
    };
  }, [locked]);
}
