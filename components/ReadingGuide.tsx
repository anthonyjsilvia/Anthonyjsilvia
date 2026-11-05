"use client";

import { useEffect, useRef } from "react";

/**
 * A horizontal band that tracks the pointer. It does not receive clicks,
 * and it stays hidden for touch, where the finger already marks the line.
 */
export default function ReadingGuide() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const place = (clientY: number) => {
      const y = clientY - el.offsetHeight / 2;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      el.hidden = false;
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        el.hidden = true;
        return;
      }
      place(e.clientY);
    };

    const hide = () => {
      el.hidden = true;
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);

  return <div ref={ref} className="reading-guide" hidden aria-hidden="true" />;
}
