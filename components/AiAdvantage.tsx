"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Bot,
  FileSearch,
  Layers,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { cineEase, dur, fadeUp } from "@/lib/motion";

type Practice = {
  Icon: typeof Sparkles;
  title: string;
  body: string;
};

const PRACTICES: Practice[] = [
  {
    Icon: FileSearch,
    title: "Discovery & synthesis",
    body:
      "I use AI to cluster notes, surface patterns, and draft problem statements faster - then I validate with associates, stakeholders, and real operational constraints.",
  },
  {
    Icon: Layers,
    title: "Exploration at speed",
    body:
      "AI helps me generate flows, variants, and copy options in minutes so I can pressure-test more directions per cycle - and still ship the one that earns stakeholder alignment.",
  },
  {
    Icon: Workflow,
    title: "Delivery leverage",
    body:
      "From tickets and acceptance criteria to research scripts and handoff notes, AI cuts busywork so I spend more time on prioritization, trade-offs, and experience quality.",
  },
  {
    Icon: Zap,
    title: "Team multiplier",
    body:
      "I lead AI-assisted design practice: share workflows, raise the bar on judgment over generation, and help partners move from drafts to production-ready product experience.",
  },
];

/**
 * AI advantage — how a Product Experience Manager uses AI to raise
 * efficiency and output without inventing vanity metrics.
 */
export default function AiAdvantage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const shouldReduceMotion = useReducedMotion();
  const headerVariants = fadeUp(shouldReduceMotion, 24);

  return (
    <section
      id="ai"
      ref={ref}
      className="ai-advantage section-atmosphere border-t border-[var(--border-light)] bg-[var(--background)]"
      aria-labelledby="ai-heading"
    >
      <div className="ai-advantage__inner mx-auto w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] py-20 md:py-28">
        <motion.header
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="ai-advantage__header"
        >
          <div className="ai-advantage__badge">
            <Bot className="h-4 w-4" aria-hidden="true" />
            <span>AI in my PXM practice</span>
          </div>
          <span
            className={`accent-rule mt-5 ${inView ? "accent-rule--animate" : ""}`}
            aria-hidden="true"
          />
          <h2 id="ai-heading" className="ai-advantage__title">
            AI is how I{" "}
            <span className="ai-advantage__title-accent">ship more,</span>{" "}
            not how I skip judgment.
          </h2>
          <p className="ai-advantage__lede">
            As a Product Experience Manager I treat AI as operating leverage:
            faster drafts, broader exploration, tighter delivery loops - with
            product judgment, accessibility, and stakeholder alignment still
            owning the final call. Managers have called out my AI-driven design
            leadership and how quickly I bring emerging tools into real
            workflows.
          </p>
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

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : dur.md,
            delay: shouldReduceMotion ? 0 : 0.4,
            ease: cineEase,
          }}
          className="ai-advantage__outcomes"
        >
          <p className="ai-advantage__outcomes-label">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            What that means for hiring managers
          </p>
          <ul className="ai-advantage__outcomes-list">
            <li>
              <strong>Higher throughput</strong> - more concepts, tickets, and
              research prep completed in the same sprint window.
            </li>
            <li>
              <strong>Faster alignment</strong> - clearer options on the table
              earlier, so trade-offs get decided sooner.
            </li>
            <li>
              <strong>Quality held</strong> - AI accelerates drafts; I still
              own success criteria, accessibility, and what ships.
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
