"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import SiteBackBar from "@/components/SiteBackBar";
import {
  evidenceSections as sections,
  TWO_COLUMN_NAMES,
  PROJECT_A,
  PROJECT_B,
} from "@/lib/evidence";

/**
 * Evidence, cinematic editorial layout aligned with recommendation detail:
 * fixed back control, viewport-width stage, display typography, wide columns.
 * Lowe's initiative names and proprietary internals are redacted.
 */
export default function EvidencePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <article className="min-h-screen bg-white pb-24 dark:bg-black md:pb-32">
      <SiteBackBar href="/portfolio" label="Back to portfolio" />
      <div className="h-[4.75rem]" aria-hidden="true" />

      <div
        ref={ref}
        className="mx-auto mt-6 w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] md:mt-10"
      >
        <motion.header
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 24,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
          }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-12 max-w-3xl md:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Evidence
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]">
            Product design in practice
          </h1>
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
          />
          <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.15rem] md:leading-[1.75]">
            How I work as a Product Designer: problem framing, trade-offs,
            systems thinking, and delivery. Drawn from{" "}
            <strong>{PROJECT_A}</strong> and{" "}
            <strong>{PROJECT_B}</strong>. Short, evidence-based bullets
            hiring managers can scan. Initiative names, UI, and proprietary
            details are redacted.
          </p>
        </motion.header>

        <nav aria-label="Page sections" className="mb-14 md:mb-20">
          <ul className="flex flex-wrap gap-x-1 gap-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center rounded-full px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-20 md:space-y-28">
          {sections.map((section, sectionIndex) => {
            const isTwoColumn =
              section.projects.length >= 2 &&
              section.projects.every((p) => TWO_COLUMN_NAMES.has(p.name));

            return (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.75,
                  delay: shouldReduceMotion ? 0 : 0.05 + sectionIndex * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="scroll-mt-[5.5rem]"
              >
                <header className="mb-8 max-w-3xl md:mb-10">
                  <h2 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.04em] leading-[1.1] text-[var(--text-primary)]">
                    {section.title}
                  </h2>
                  <div
                    aria-hidden="true"
                    className="mt-5 h-[2px] w-16 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
                  />
                  <p className="mt-5 text-[1.02rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.08rem]">
                    {section.intro}
                  </p>
                </header>

                <div
                  className={
                    isTwoColumn
                      ? "grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20"
                      : "max-w-3xl space-y-10"
                  }
                >
                  {section.projects.map((project) => (
                    <div key={project.name + section.id} className="min-w-0">
                      <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                        {project.name}
                      </h3>
                      <ul className="mt-5 list-none space-y-4 pl-0">
                        {project.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-[1.02rem] leading-[1.72] text-[var(--text-secondary)] md:text-[1.05rem] md:leading-[1.75]"
                          >
                            <span
                              className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)]"
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
