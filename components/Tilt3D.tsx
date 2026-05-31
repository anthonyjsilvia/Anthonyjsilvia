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
 *
 * Click-reliability — small interactive children "freeze" the tilt:
 *  When the pointer hovers a *small* interactive descendant (button, link,
 *  input, etc., where the descendant covers less than ~75% of the card area),
 *  rotational parallax pauses at the current angle. This stops the card from
 *  rotating the button out from under the cursor mid-aim, so clicks land on
 *  the button rather than on the surrounding card. The hover lift and scale
 *  stay on so the card still reads as "actively hovered"; only the rotation
 *  is paused. Wrapper-style interactives (an `<a>` that *is* the whole card,
 *  e.g. the high-school varsity badges) continue to tilt normally, since
 *  every click on them is valid no matter the angle. Authors can opt any
 *  element into the freeze behaviour explicitly by setting
 *  `data-tilt-stable`.
 */

/** CSS selector for interactive descendants that should pause the tilt. */
const INTERACTIVE_CHILD_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  "[data-tilt-stable]",
].join(",");

/**
 * If a matched interactive covers ≥ this fraction of the card area, we treat
 * it as a "wrapper interactive" (the whole card is one big link) and keep
 * tilting normally — clicks land anywhere on it anyway, and freezing the
 * tilt would defeat the whole effect on link-cards like the school badges.
 */
const WRAPPER_INTERACTIVE_AREA_RATIO = 0.75;
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

    // If the pointer is over a *small* interactive child (i.e. the kind of
    // button or link that lives inside the card rather than wrapping the
    // whole thing), pause rotational tracking so the child stays anchored
    // under the cursor for a reliable click. See the component-level docs
    // above for the rationale and the wrapper-interactive carve-out.
    //
    // We don't reset rotation to 0 here — that would yank the child *away*
    // from the cursor as the rotation unwinds, recreating the same
    // moving-target problem in reverse. Instead we just stop updating
    // `px` / `py`, leaving the spring to settle at whatever rotation it
    // had on entry.
    const target = e.target as HTMLElement | null;
    const interactive = target?.closest(INTERACTIVE_CHILD_SELECTOR) as HTMLElement | null;
    if (interactive && interactive !== el && el.contains(interactive)) {
      const ir = interactive.getBoundingClientRect();
      const cardArea = rect.width * rect.height;
      const intArea = ir.width * ir.height;
      if (cardArea > 0 && intArea / cardArea < WRAPPER_INTERACTIVE_AREA_RATIO) {
        return;
      }
    }

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
