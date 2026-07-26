"use client";

import {
  useCallback,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

export type HoverGlowVariant = "primary" | "secondary";

type Intensity = "card" | "control";

/**
 * Shared pointer handler used by Hero CTAs and every other hover surface.
 * Writes `--glow-x` / `--glow-y` directly on the element (no React re-render).
 */
export function attachHeroGlowMove(
  el: HTMLElement | null,
  e: React.PointerEvent,
  shouldReduceMotion: boolean | null,
) {
  if (shouldReduceMotion || !el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
}

type HoverGlowShellProps = {
  children: ReactNode;
  className?: string;
  /** primary = white orb (filled accent). secondary = brand-blue orb (surfaces / outlines). */
  variant?: HoverGlowVariant;
  /** control gets a slight scale; card stays put (glow only). */
  intensity?: Intensity;
  as?: "div" | "section" | "article" | "span";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * Hero-matching hover shell: cursor-tracking glow ball + optional control scale.
 */
export default function HoverGlowShell({
  children,
  className = "",
  variant = "secondary",
  intensity = "card",
  as: Tag = "div",
  onPointerMove,
  ...rest
}: HoverGlowShellProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      attachHeroGlowMove(ref.current, e, shouldReduceMotion);
      onPointerMove?.(e);
    },
    [onPointerMove, shouldReduceMotion],
  );

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={[
        "hover-glow",
        variant === "primary" ? "hover-glow--primary" : "hover-glow--secondary",
        intensity === "control" ? "hover-glow--control" : "hover-glow--card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerMove={handleMove}
      {...rest}
    >
      <span aria-hidden="true" className="hover-glow__orb" />
      <div className="hover-glow__content">{children}</div>
    </Tag>
  );
}

/**
 * Props to spread onto a native `a` / `button` so it gets the same hero glow
 * without an extra wrapper (preserves semantics + download/href behavior).
 */
export function useHeroGlowProps(variant: HoverGlowVariant = "secondary") {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      attachHeroGlowMove(ref.current, e, shouldReduceMotion);
    },
    [shouldReduceMotion],
  );

  return {
    ref,
    className: [
      "hover-glow",
      "hover-glow--control",
      variant === "primary" ? "hover-glow--primary" : "hover-glow--secondary",
    ].join(" "),
    onPointerMove,
  };
}
