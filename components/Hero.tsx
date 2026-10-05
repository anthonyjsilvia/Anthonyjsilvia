"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, FileText, Layers } from "lucide-react";
import Image from "next/image";
import { type ElementType, type ReactNode, useEffect, useRef } from "react";
import { heroItem, heroStagger } from "@/lib/motion";

/**
 * Hero CTA - pill control with cursor-tracking glow (NodeDa-style shape,
 * site-native hover orb).
 */
type HeroCTAProps = {
  href: string;
  external?: boolean;
  Icon: ElementType;
  children: ReactNode;
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

  const base =
    "hero-cta hover-glow hover-glow--control btn-apple-lift relative isolate overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[0.95rem] sm:text-base cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]";

  const variantClasses =
    variant === "primary"
      ? "hero-cta-primary hover-glow--primary bg-[var(--primary)] text-white shadow-[0_12px_32px_-14px_rgba(var(--primary-rgb),0.65)]"
      : "hero-cta-secondary hover-glow--secondary bg-white/12 text-white border border-white/35 backdrop-blur-[8px] hover:bg-white/20 hover:border-white/55";

  return (
    <a
      ref={anchorRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={handlePointerMove}
      className={`${base} ${variantClasses}`}
      aria-label={ariaLabel}
    >
      <span aria-hidden="true" className="hero-cta-glow hover-glow__orb" />
      <span className="relative z-10 inline-flex items-center gap-2">
        <Icon className="w-4 h-4 sm:w-[1.1rem] sm:h-[1.1rem]" aria-hidden="true" />
        {children}
      </span>
    </a>
  );
}

/** Portrait drifts slower than scroll for depth; copy stays locked to the stage. */
const PARALLAX_PORTRAIT = 0.18;

/**
 * Cinematic cutout hero: atmospheric stage + oversized portrait bleeding
 * the right edge, brand copy owning the left. One composition.
 */
export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const portraitRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const item = heroItem(shouldReduceMotion);
  const stagger = heroStagger(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const apply = () => {
      rafRef.current = null;
      const y = window.scrollY;
      const capped = Math.min(y, window.innerHeight);
      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate3d(0, ${capped * PARALLAX_PORTRAIT}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion]);

  return (
    <section
      id="hero"
      className="hp-cine-hero relative h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-atmosphere__wash" />
        <div className="hero-atmosphere__grid" />
        <div className="hero-atmosphere__craft">
          <span className="hero-atmosphere__board hero-atmosphere__board--a" />
          <span className="hero-atmosphere__board hero-atmosphere__board--b" />
          <span className="hero-atmosphere__board hero-atmosphere__board--c" />
          <span className="hero-atmosphere__chip hero-atmosphere__chip--a" />
          <span className="hero-atmosphere__chip hero-atmosphere__chip--b" />
          <span className="hero-atmosphere__flow" />
          <span className="hero-atmosphere__guides" />

          {/* Desktop left-side craft — fills empty stage beside copy */}
          <span className="hero-atmosphere__board hero-atmosphere__board--l1" />
          <span className="hero-atmosphere__board hero-atmosphere__board--l2" />
          <span className="hero-atmosphere__board hero-atmosphere__board--l3" />
          <span className="hero-atmosphere__swatches" />
          <span className="hero-atmosphere__wire" />
          <span className="hero-atmosphere__anno" />
          <span className="hero-atmosphere__rail" />
        </div>
        <div className="hero-atmosphere__veil" />
      </div>

      <div className="hero-portrait-slot" aria-hidden="true">
        <motion.div
          ref={portraitRef}
          className="hero-portrait"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.15,
            ease: [0.22, 1, 0.36, 1],
            delay: shouldReduceMotion ? 0 : 0.12,
          }}
        >
          <div className="hero-portrait__glow" />
          <div className="hero-portrait__shadow" />
          <Image
            src="/homepage/hero-cutout.png"
            alt=""
            width={3558}
            height={3658}
            priority
            className="hero-portrait__img"
            sizes="(max-width: 768px) 90vw, 50vw"
            quality={95}
          />
        </motion.div>
      </div>

      {/* Progressive bottom blur (stacked masked layers — works beyond Safari) */}
      <div className="hero-fade-blur" aria-hidden="true">
        <div className="hero-fade-blur__layer hero-fade-blur__layer--1" />
        <div className="hero-fade-blur__layer hero-fade-blur__layer--2" />
        <div className="hero-fade-blur__layer hero-fade-blur__layer--3" />
        <div className="hero-fade-blur__layer hero-fade-blur__layer--4" />
        <div className="hero-fade-blur__tint" />
      </div>

      <motion.div
        className="hp-cine-copy absolute inset-x-0 bottom-0 z-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p
          variants={item}
          className="font-sans text-[clamp(0.75rem,1.1vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-white/65"
        >
          Product Designer · MBA
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={item}
          className="font-display mt-3 text-[clamp(2.6rem,7vw,4.6rem)] font-extrabold tracking-[-0.03em] leading-[0.98] text-white max-w-[11ch]"
        >
          Anthony Silvia
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 md:mt-5 font-sans text-[clamp(1.05rem,1.7vw,1.25rem)] font-medium leading-[1.55] text-white/85 max-w-[28rem]"
        >
          I turn complex operational workflows into clear product experiences.
        </motion.p>

        <motion.div
          variants={item}
          className="hero-copy-actions mt-8 md:mt-10 flex flex-wrap gap-3"
        >
          <HeroCTA
            href="#work"
            Icon={Layers}
            variant="primary"
            ariaLabel="See selected work"
          >
            Selected work
          </HeroCTA>
          <HeroCTA
            href="/resume"
            Icon={FileText}
            variant="secondary"
            ariaLabel="Request resume"
          >
            Request Resume
          </HeroCTA>
        </motion.div>
      </motion.div>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          delay: shouldReduceMotion ? 0 : 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hero-read-more absolute bottom-[var(--hp-cine-pad,1.25rem)] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:left-auto md:right-[var(--hp-cine-pad,1.25rem)] md:translate-x-0"
        aria-label="See selected work"
      >
        <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em]">
          Selected work
        </span>
        <ChevronDown
          className="hero-read-more__chevron h-5 w-5"
          aria-hidden="true"
        />
      </motion.a>
    </section>
  );
}
