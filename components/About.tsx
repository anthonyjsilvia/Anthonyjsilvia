"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * About - NodeDa-style cinematic rhythm:
 * manifesto billboard → one sparse product-style stage (portrait + copy).
 */
export default function About() {
  const manifestoRef = useRef(null);
  const stageRef = useRef(null);
  const manifestoInView = useInView(manifestoRef, { once: true, margin: "-12%" });
  const stageInView = useInView(stageRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 32,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const sharpReveal = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.9,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <>
      {/* Manifesto - one billboard line */}
      <section
        id="about"
        ref={manifestoRef}
        className="hp-cine-manifesto bg-[var(--background)]"
        aria-label="About"
      >
        <motion.p
          initial="hidden"
          animate={manifestoInView ? "visible" : "hidden"}
          variants={reveal}
          className="font-display mx-auto max-w-[16ch] text-center text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
        >
          Outcomes that create real value for users and the business.
        </motion.p>
      </section>

      {/* Stage - portrait + copy */}
      <section
        ref={stageRef}
        className="hp-cine-stage border-t border-[var(--border-light)] bg-[var(--bg-secondary)]"
        aria-labelledby="about-heading"
      >
        <div className="hp-cine-stage__inner">
          <motion.div
            initial="hidden"
            animate={stageInView ? "visible" : "hidden"}
            variants={sharpReveal}
            className="hp-cine-stage__visual"
          >
            <Image
              src="/me.PNG"
              alt="Anthony Silvia"
              width={440}
              height={440}
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={stageInView ? "visible" : "hidden"}
            variants={reveal}
            className="hp-cine-stage__copy"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              About
            </p>
            <h2
              id="about-heading"
              className="font-display mt-4 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--text-primary)] max-w-[18ch]"
            >
              Product experience, end to end.
            </h2>
            <p className="mt-5 max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.2rem)] font-medium leading-[1.55] text-[var(--text-secondary)]">
              Product Designer at Lowe&apos;s, working on complex retail
              operations - usability, friction, and alignment with product and engineering.
              Through NodeDa, I lead discovery through delivery with accessibility and
              operational reality in view.
            </p>
            <Link
              href="/experience"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(var(--primary-rgb),0.55)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              View experience
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
