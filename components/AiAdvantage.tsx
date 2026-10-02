"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileSearch, Layers, Sparkles, Workflow } from "lucide-react";
import { cineEase, dur, fadeUp } from "@/lib/motion";
import { aiPracticeIntro, aiPractices } from "@/lib/ai-practices";

const PRACTICE_ICONS = [FileSearch, Layers, Workflow] as const;

/**
 * How I design: compressed practice strip (AI + craft), not a long sermon.
 */
export default function AiAdvantage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const shouldReduceMotion = useReducedMotion();
  const headerVariants = fadeUp(shouldReduceMotion, 24);
  const PRACTICES = aiPractices.map((p, i) => ({
    ...p,
    Icon: PRACTICE_ICONS[i] ?? Sparkles,
  }));

  return (
    <section
      id="practice"
      ref={ref}
      className="ai-advantage section-atmosphere border-t border-[var(--border-light)] bg-[var(--background)]"
      aria-labelledby="practice-heading"
    >
      <div className="ai-advantage__inner mx-auto w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] py-16 md:py-24">
        <motion.header
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="ai-advantage__header"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            {aiPracticeIntro.eyebrow}
          </p>
          <span
            className={`accent-rule mt-5 ${inView ? "accent-rule--animate" : ""}`}
            aria-hidden="true"
          />
          <h2 id="practice-heading" className="ai-advantage__title">
            {aiPracticeIntro.title}
          </h2>
          <p className="ai-advantage__lede">{aiPracticeIntro.lede}</p>
        </motion.header>

        <ul role="list" className="ai-advantage__grid">
          {PRACTICES.map((item, index) => (
            <motion.li
              key={item.title}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 24,
              }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: shouldReduceMotion ? 0 : 24 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : dur.xl,
                delay: shouldReduceMotion ? 0 : 0.1 + index * 0.08,
                ease: cineEase,
              }}
              className="ai-advantage__item"
            >
              <div className="ai-advantage__card">
                <span className="ai-advantage__icon" aria-hidden="true">
                  <item.Icon className="h-5 w-5" />
                </span>
                <h3 className="ai-advantage__card-title">{item.title}</h3>
                <p className="ai-advantage__card-body">{item.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
