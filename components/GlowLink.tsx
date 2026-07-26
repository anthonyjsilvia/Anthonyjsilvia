"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useCallback, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  attachHeroGlowMove,
  type HoverGlowVariant,
} from "@/components/HoverGlow";

type GlowLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: HoverGlowVariant;
  children: ReactNode;
};

function isInternalHref(href: string | undefined): href is string {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}

/**
 * Anchor with the homepage Hero CTA hover: cursor glow + scale.
 * Internal paths use Next.js Link for client navigation.
 */
export default function GlowLink({
  variant = "primary",
  className = "",
  children,
  onPointerMove,
  href,
  ...rest
}: GlowLinkProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      attachHeroGlowMove(ref.current, e, shouldReduceMotion);
      onPointerMove?.(e);
    },
    [onPointerMove, shouldReduceMotion],
  );

  const classes = [
    "hover-glow",
    "hover-glow--control",
    variant === "primary" ? "hover-glow--primary" : "hover-glow--secondary",
    "relative isolate overflow-hidden inline-flex items-center justify-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span aria-hidden="true" className="hover-glow__orb" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (isInternalHref(href)) {
    return (
      <Link
        {...rest}
        href={href}
        ref={ref}
        onPointerMove={handleMove}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      {...rest}
      href={href}
      ref={ref}
      onPointerMove={handleMove}
      className={classes}
    >
      {content}
    </a>
  );
}
