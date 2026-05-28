"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, Linkedin, Mail } from "lucide-react";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import Tilt3D from "@/components/Tilt3D";

const FADE_START = 0; // start fading as soon as user scrolls
const FADE_END = 0.27; // finish fading after ~27% of viewport (0.4 / 1.5)

/**
 * Hero CTA — a single anchor that owns its whole rectangle as both the click
 * target and the hover target. The whole pill is the link; the icon and label
 * sit on a `relative z-10` content span so they live above the cursor-tracking
 * glow without ever stealing pointer events from the anchor itself.
 *
 * A soft "hover ball" — a radial-gradient orb that follows the cursor — is
 * rendered inside an absolutely-positioned span with `pointer-events: none`.
 * It's positioned via two CSS custom properties (`--glow-x`, `--glow-y`) set
 * directly on the anchor's style on `pointerMove`, so the highlight tracks the
 * cursor at 60fps without re-rendering React on every frame.
 *
 * Reduced motion: the move handler is short-circuited so the ball just sits at
 * the default 50%/50% spot — no chase animation, but the button still hovers.
 */
type HeroCTAProps = {
  href: string;
  /** External link → opens in a new tab with safe `rel`. */
  external?: boolean;
  /**
   * Any React component that can render an icon. Typed as `ElementType` so
   * lucide-react's `ForwardRefExoticComponent` icons (which use the broader
   * `Booleanish` type for `aria-hidden`) are assignable here.
   */
  Icon: ElementType;
  children: ReactNode;
  /** `primary` = solid brand button (white glow). `secondary` = outlined / pale (primary-blue glow). */
  variant: "primary" | "secondary";
  ariaLabel: string;
};

function HeroCTA({
  href,
  external,
  Icon,
  children,
  variant,
  ariaLabel,
}: HeroCTAProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  // `overflow-hidden` clips the glow to the button's rounded corners.
  // `isolation` keeps the stacking context local to the button so the glow
  // span and the content span layer cleanly without affecting siblings.
  const base =
    "hero-cta btn-3d relative isolate overflow-hidden inline-flex items-center justify-center gap-2 min-w-[180px] px-8 py-4 rounded-lg font-semibold text-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]";

  const variantClasses =
    variant === "primary"
      ? "hero-cta-primary bg-[var(--primary)] text-white"
      : "hero-cta-secondary btn-3d-light bg-white/95 dark:bg-white/10 text-[var(--text-primary)] dark:text-white border-2 border-white/30 hover:border-white hover:bg-white hover:text-[var(--primary)] dark:hover:bg-white/20";

  return (
    <motion.a
      ref={anchorRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={handlePointerMove}
      className={`${base} ${variantClasses}`}
      whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
      aria-label={ariaLabel}
    >
      {/* Cursor-tracking hover ball. Always rendered, opacity-driven via CSS
          hover/focus state on the parent. Pointer-events disabled so the
          anchor stays the sole hit target. */}
      <span aria-hidden="true" className="hero-cta-glow" />
      <span className="relative z-10 inline-flex items-center gap-2">
        <Icon className="w-5 h-5" aria-hidden="true" />
        {children}
      </span>
    </motion.a>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const fadeRange = vh * FADE_END;
      const progress = Math.min(1, scrollY / fadeRange);
      setBgOpacity(1 - progress);
    };

    handleScroll(); // set initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldReduceMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut",
      },
    },
  };

  if (!mounted) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <img
          src="/homepage/ashero.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-white">
            Anthony Silvia
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-black"
      aria-labelledby="hero-heading"
    >
      {/* Full-viewport background image + overlay: fade on scroll */}
      <div
        className="absolute inset-0 transition-opacity duration-100 ease-out"
        style={{ opacity: shouldReduceMotion ? 1 : bgOpacity }}
        aria-hidden="true"
      >
        <img
          src="/homepage/ashero.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center min-h-screen"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-opacity duration-100 ease-out"
        style={{ opacity: shouldReduceMotion ? 1 : bgOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Tilt3D
          max={6}
          lift={18}
          scale={1.01}
          glare={false}
          roundedClassName="rounded-2xl"
          containerClassName="inline-block w-full"
          className="rounded-2xl"
        >
          {/* Location badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-6"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 shadow-lg">
              Charlotte Metro
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-2xl"
            style={{ transform: "translateZ(60px)" }}
          >
            Anthony Silvia
          </motion.h1>

          {/* Headline: transitioning to PM; product design roots, enterprise & accessibility */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md"
            style={{ transform: "translateZ(30px)" }}
          >
            Product Experience Manager | UX, Engineering & Data Integration
          </motion.p>
        </Tilt3D>

        {/*
          CTA Row — intentionally rendered OUTSIDE the <Tilt3D> wrapper.

          The Tilt3D applies `transform-style: preserve-3d` plus rotateX /
          rotateY on hover, which means every descendant becomes a child of a
          3D scene. Two problems show up for interactive descendants:

            1) Hit-test drift. When the card tilts, the buttons' projected
               screen rects diverge from their unrotated bounding rects;
               several browsers (notably WebKit) hit-test against the
               unrotated rect, leaving "dead zones" near the rotated edges
               where the button is visible but unclickable.
            2) Stacking-context conflicts. The HeroCTA uses `overflow-hidden`
               + `isolation: isolate` to contain its hover-ball glow. Inside
               a preserve-3d parent, those properties create flattening
               stacking contexts that interact unpredictably with the parent
               rotation — manifesting as the "clipping" / lost interactivity
               you saw.

          Pulling the buttons out keeps them in flat 2D space (perfect hit
          testing, perfect glow clipping via border-radius) while the
          wordmark/tagline group above continues to tilt and lift as before.
        */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <HeroCTA
            href="/resume"
            Icon={FileText}
            variant="primary"
            ariaLabel="Open resume page"
          >
            View Resume
          </HeroCTA>
          <HeroCTA
            href="https://linkedin.com/in/anthonyjsilvia"
            external
            Icon={Linkedin}
            variant="secondary"
            ariaLabel="Open LinkedIn profile in new tab"
          >
            LinkedIn
          </HeroCTA>
          <HeroCTA
            href="mailto:contact@anthonysilvia.com"
            Icon={Mail}
            variant="secondary"
            ariaLabel="Send email to contact at anthonysilvia.com"
          >
            Email
          </HeroCTA>
        </motion.div>
      </motion.div>
    </section>
  );
}
