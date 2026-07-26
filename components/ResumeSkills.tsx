"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

/**
 * Skills tab for /experience — driven by NodeDa Resume `profile.skills`.
 */
export default function ResumeSkills({ skills }: { skills?: string[] | null }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const list = skills?.filter(Boolean) ?? [];

  return (
    <section
      id="skills"
      ref={ref}
      className="hp-cine-stage bg-[var(--bg-secondary)]"
      aria-labelledby="skills-heading"
    >
      <div className="w-full max-w-[var(--hp-cine-max)] mx-auto">
        <motion.div
          className="mb-12 md:mb-16 max-w-3xl"
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 24,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
          }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Toolkit
          </p>
          <h2
            id="skills-heading"
            className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
          >
            Skills
          </h2>
        </motion.div>

        {list.length === 0 ? (
          <p className="text-[var(--text-secondary)] font-medium">
            Skills will appear here once the live resume snapshot includes them.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[var(--border-light)] pt-8 md:pt-10"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                Capabilities
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2.5" role="list">
              {list.map((skill) => (
                <li key={skill}>
                  <span className="inline-flex items-center rounded-full border border-[var(--border-light)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}
