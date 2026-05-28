"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionStyle,
} from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

interface Tilt3DProps {
  children: ReactNode;
  /** Max rotation in degrees on each axis. Default 8. */
  max?: number;
  /** Z-axis lift on hover (px). Default 24. */
  lift?: number;
  /** Scale on hover. Default 1.015. */
  scale?: number;
  /** Show subtle moving glare sheen. Default true. */
  glare?: boolean;
  /** Perspective distance in px. Default 1200. */
  perspective?: number;
  /** Stiffness for spring. Default 220. */
  stiffness?: number;
  /** Damping for spring. Default 22. */
  damping?: number;
  /** Extra classNames on the inner wrapper. */
  className?: string;
  /** Extra classNames on the outer perspective container. */
  containerClassName?: string;
  /** Round-corners — applied to glare overlay so it follows shape. Default "rounded-2xl". */
  roundedClassName?: string;
  /** Optional inline style on outer container. */
  style?: CSSProperties;
}

/**
 * Tilt3D — mouse-tracked 3D tilt wrapper with depth, lift, and subtle glare.
 *
 * Accessibility:
 *  - Honors prefers-reduced-motion (and the user's app-level setting via framer-motion's
 *    useReducedMotion). Falls back to a static, non-tilted shadow lift on hover.
 *  - Keeps content readable at all rotation angles.
 *  - Pointer-only interaction — the wrapper still bubbles focus to inner interactives.
 */
export default function Tilt3D({
  children,
  max = 8,
  lift = 24,
  scale = 1.015,
  glare = true,
  perspective = 1200,
  stiffness = 220,
  damping = 22,
  className = "",
  containerClassName = "",
  roundedClassName = "rounded-2xl",
  style,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalized pointer position from -0.5..0.5 across the element
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0); // 0 idle, 1 hovering

  const springConfig = { stiffness, damping, mass: 0.6 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);
  const sh = useSpring(hover, { stiffness: 180, damping: 24, mass: 0.5 });

  // y position → rotateX (inverted so top tilts away), x → rotateY
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const translateZ = useTransform(sh, [0, 1], [0, lift]);
  const scl = useTransform(sh, [0, 1], [1, scale]);

  // Glare: a soft white radial that follows the cursor
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.18]);
  const glareBg = useTransform(
    [sx, sy] as never,
    ([x, y]: number[]) => {
      const px = (x + 0.5) * 100;
      const py = (y + 0.5) * 100;
      return `radial-gradient(420px circle at ${px}% ${py}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)`;
    },
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(nx);
    py.set(ny);
  };

  const handleEnter = () => {
    if (shouldReduceMotion) return;
    hover.set(1);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  // Reduced-motion fallback: a simple class-based hover lift, no tilt.
  if (shouldReduceMotion) {
    return (
      <div
        className={`${containerClassName} transition-shadow duration-200 hover:shadow-2xl ${roundedClassName}`}
        style={style}
      >
        <div className={className}>{children}</div>
      </div>
    );
  }

  const innerStyle: MotionStyle = {
    rotateX,
    rotateY,
    translateZ,
    scale: scl,
    transformStyle: "preserve-3d",
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className={`${containerClassName} ${roundedClassName}`}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <motion.div
        className={`relative ${className}`}
        style={innerStyle}
      >
        {children}

        {glare && (
          // Glare overlay. The wrapper is pinned at Z=0 so it doesn't sit in front
          // of interactive children (any sibling at Z=0 would otherwise lose hit
          // testing because of how `mix-blend-mode` creates a stacking context
          // inside a `transform-style: preserve-3d` parent). The blend mode lives
          // on the inner element so its stacking-context side-effects stay
          // isolated from siblings of the glare wrapper.
          <motion.div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${roundedClassName}`}
            style={{ transform: "translateZ(0px)" }}
          >
            <motion.div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 ${roundedClassName}`}
              style={{
                background: glareBg,
                opacity: glareOpacity,
                mixBlendMode: "overlay",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
