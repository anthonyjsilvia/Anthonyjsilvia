"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, FileText, Layers, Linkedin } from "lucide-react";
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

function HeroScrim() {
  return <div className="hero-scrim absolute inset-0" aria-hidden="true" />;
}

/** Image drifts on scroll for depth; copy/CTAs scroll with the page (no parallax). */
const PARALLAX_IMG = 0.38;

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const item = heroItem(shouldReduceMotion);
  const stagger = heroStagger(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const apply = () => {
      rafRef.current = null;
      const y = window.scrollY;
      const capped = Math.min(y, window.innerHeight);
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(0, ${capped * PARALLAX_IMG}px, 0) scale(1.12)`;
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
      className="hp-cine-hero relative h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden bg-[#070a12]"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          ref={imgRef}
          src="/homepage/ashero.PNG"
          alt=""
          className="hero-parallax-img hero-parallax-img--enter absolute inset-0 h-full w-full min-h-full object-cover object-[70%_42%] md:object-[center_42%] will-change-transform"
          style={
            shouldReduceMotion
              ? undefined
              : { transform: "translate3d(0, 0, 0) scale(1.12)" }
          }
        />
        <HeroScrim />
      </div>

      <motion.div
        className="hp-cine-copy absolute inset-x-0 bottom-0 z-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.h1
          id="hero-heading"
          variants={item}
          className="font-display text-[clamp(2.4rem,6.5vw,4.25rem)] font-extrabold tracking-[-0.045em] leading-[0.98] text-white max-w-[14ch]"
        >
          Anthony Silvia
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 md:mt-4 font-display text-[clamp(1.05rem,1.6vw,1.25rem)] font-semibold tracking-[-0.02em] text-white"
        >
          Product Experience Manager
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 md:mt-4 text-[clamp(1.05rem,1.7vw,1.25rem)] font-medium leading-[1.55] text-white/85 max-w-[36rem]"
        >
          Product Experience Manager who uses AI to raise efficiency and
          output - turning messy operational problems into clear product
          experiences, with judgment still owning what ships.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 md:mt-10 flex flex-wrap gap-3"
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
            href="/evidence"
            Icon={Layers}
            variant="secondary"
            ariaLabel="How I work - evidence from shipped projects"
          >
            How I work
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
        <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em]">
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
