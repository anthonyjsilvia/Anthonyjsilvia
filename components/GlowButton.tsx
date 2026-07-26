"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  attachHeroGlowMove,
  type HoverGlowVariant,
} from "@/components/HoverGlow";

type GlowButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: HoverGlowVariant;
  children: ReactNode;
};

/**
 * Button with the homepage Hero CTA hover: cursor glow + scale.
 */
export default function GlowButton({
  variant = "secondary",
  className = "",
  children,
  onPointerMove,
  ...rest
}: GlowButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      attachHeroGlowMove(ref.current, e, shouldReduceMotion);
      onPointerMove?.(e);
    },
    [onPointerMove, shouldReduceMotion],
  );

  return (
    <button
      {...rest}
      ref={ref}
      onPointerMove={handleMove}
      className={[
        "hover-glow",
        "hover-glow--control",
        variant === "primary" ? "hover-glow--primary" : "hover-glow--secondary",
        "relative isolate overflow-hidden inline-flex items-center justify-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true" className="hover-glow__orb" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
