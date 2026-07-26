"use client";

import type { HTMLAttributes, ReactNode } from "react";
import HoverGlowShell, {
  useHeroGlowProps,
  type HoverGlowVariant,
} from "@/components/HoverGlow";

type Intensity = "card" | "control";

type FluentRevealProps = {
  children: ReactNode;
  className?: string;
  intensity?: Intensity;
  /** Maps to hero glow: control accents → primary, surfaces → secondary. */
  variant?: HoverGlowVariant;
  as?: "div" | "section" | "article" | "span";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * @deprecated name kept for call sites - now the homepage Hero CTA glow.
 */
export function useFluentRevealProps(intensity: Intensity = "control") {
  const variant: HoverGlowVariant =
    intensity === "control" ? "secondary" : "secondary";
  const glow = useHeroGlowProps(variant);
  return {
    ref: glow.ref,
    className: glow.className,
    style: undefined as undefined,
    onPointerMove: glow.onPointerMove,
    onPointerEnter: () => {},
    onPointerLeave: () => {},
  };
}

/**
 * Hover surface matching homepage Hero CTA buttons: cursor-tracking glow orb.
 */
export default function FluentReveal({
  children,
  className = "",
  intensity = "card",
  variant,
  as = "div",
  ...rest
}: FluentRevealProps) {
  const resolvedVariant: HoverGlowVariant =
    variant ?? (intensity === "control" ? "primary" : "secondary");

  return (
    <HoverGlowShell
      as={as}
      intensity={intensity}
      variant={resolvedVariant}
      className={className}
      {...rest}
    >
      {children}
    </HoverGlowShell>
  );
}
