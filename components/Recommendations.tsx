"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { recommendations } from "@/lib/recommendations";

/**
 * Flat portrait tile - soft hover scale, cinematic radius.
 */
function RecommendationTile({
  rec,
}: {
  rec: (typeof recommendations)[number];
}) {
  const href = `/recommendations/${rec.slug}`;
  const ariaLabel = `Read recommendation from ${rec.name}, ${rec.role}`;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="group relative block w-full aspect-square overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      style={{ borderRadius: "clamp(16px, 2vw, 28px)" }}
    >
      <Image
        src={rec.image}
        alt=""
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left">
        <p className="text-white font-bold text-sm sm:text-[0.95rem] tracking-[-0.02em]">
          {rec.name}
        </p>
        <p className="text-white/75 text-xs sm:text-sm mt-0.5 font-medium">{rec.role}</p>
      </div>
    </Link>
  );
}

/**
 * Recommendations - sparse cinematic stage after About.
 */
export default function Recommendations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.85,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const titleReveal = {
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

  return (
    <section
      id="recommendations"
      ref={ref}
      className="hp-cine-recs scroll-mt-24 bg-[var(--background)] border-t border-[var(--border-light)]"
      aria-labelledby="recommendations-heading"
    >
      <div className="hp-cine-recs__inner">
        <motion.h2
          id="recommendations-heading"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleReveal}
          className="font-display mx-auto mb-12 md:mb-16 max-w-[14ch] text-center text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
        >
          Kind words from people I&rsquo;ve worked with.
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full"
        >
          {recommendations.map((rec) => (
            <motion.div key={rec.slug} variants={itemVariants}>
              <RecommendationTile rec={rec} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
