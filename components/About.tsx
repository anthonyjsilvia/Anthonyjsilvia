"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, fadeUpBlur } from "@/lib/motion";

/**
 * About - compact stage after homepage proof: portrait + PX Manager bridge copy.
 */
export default function About() {
  const stageRef = useRef(null);
  const stageInView = useInView(stageRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();
  const reveal = fadeUpBlur(shouldReduceMotion);
  const sharpReveal = fadeUp(shouldReduceMotion, 28);

  return (
    <section
      id="about"
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
          <span
            className={`accent-rule mt-4 ${stageInView ? "accent-rule--animate" : ""}`}
            aria-hidden="true"
          />
          <h2
            id="about-heading"
            className="font-display mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--text-primary)] max-w-[20ch]"
          >
            Product experience, AI-accelerated.
          </h2>
          <p className="mt-5 max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.2rem)] font-medium leading-[1.55] text-[var(--text-secondary)]">
            I work at the intersection of product management and UX - and I
            run that practice with AI in the loop: faster discovery synthesis,
            broader design exploration, and higher delivery throughput without
            handing the product decisions to a model. Currently a Product
            Designer at Lowe&apos;s on enterprise retail ops, and Principal
            Consultant at NodeDa leading discovery through delivery with
            accessibility and operational reality in view.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/experience"
              className="btn-apple-lift inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(var(--primary-rgb),0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              View experience
            </Link>
            <Link
              href="/contact"
              className="btn-apple-lift inline-flex items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
