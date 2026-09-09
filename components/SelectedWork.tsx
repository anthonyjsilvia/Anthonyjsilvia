"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { cineEase, dur, fadeUp } from "@/lib/motion";

type WorkItem = {
  href: string;
  eyebrow: string;
  title: string;
  context: string;
  role: string;
};

const WORK: WorkItem[] = [
  {
    href: "/evidence#ambiguity",
    eyebrow: "Lowe's",
    title: "Defined success criteria when “better CX” was vague",
    context:
      "Return Space: short discovery with associates and managers turned fuzzy goals into measurable direction for faster processing and fewer callbacks.",
    role: "Design + product partnership",
  },
  {
    href: "/evidence#trade-offs",
    eyebrow: "Lowe's",
    title: "Prioritized scope so the first release could ship",
    context:
      "Pro Supply returns: aligned leadership on timeline and highest-impact flows, balancing ideal UX against build complexity without blocking delivery.",
    role: "Prioritization & stakeholder alignment",
  },
  {
    href: "/portfolio",
    eyebrow: "NodeDa",
    title: "Owned discovery through delivery on an indie product",
    context:
      "Kinlily: end-to-end product lifecycle ownership - research, design, and iteration for a cloud cookbook experience.",
    role: "Product ownership + UX",
  },
];

/**
 * Homepage proof strip — editorial, scannable proof for hiring managers.
 * Surfaces are interaction containers (links), not decorative card chrome.
 */
export default function SelectedWork() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const shouldReduceMotion = useReducedMotion();
  const headerVariants = fadeUp(shouldReduceMotion, 24);

  return (
    <section
      id="work"
      ref={ref}
      className="selected-work section-atmosphere border-t border-[var(--border-light)] bg-[var(--bg-secondary)]"
      aria-labelledby="work-heading"
    >
      <div className="selected-work__inner mx-auto w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] py-20 md:py-28">
        <motion.header
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="selected-work__header"
        >
          <div className="selected-work__header-copy">
            <p className="selected-work__eyebrow">Selected work</p>
            <span
              className={`accent-rule mt-4 ${inView ? "accent-rule--animate" : ""}`}
              aria-hidden="true"
            />
            <h2 id="work-heading" className="selected-work__title">
              Problem, decision,{" "}
              <span className="selected-work__title-accent">outcome.</span>
            </h2>
          </div>
          <p className="selected-work__lede">
            NDA-safe proof from enterprise ops and end-to-end product work -
            including AI-accelerated discovery and delivery - enough to scan
            in under a minute, with deeper evidence one click away.
          </p>
        </motion.header>

        <ul role="list" className="selected-work__grid">
          {WORK.map((item, index) => {
            const n = String(index + 1).padStart(2, "0");
            return (
              <motion.li
                key={item.href + item.title}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 28,
                }}
                animate={
                  inView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : dur.xl,
                  delay: shouldReduceMotion ? 0 : 0.12 + index * 0.1,
                  ease: cineEase,
                }}
                className="selected-work__item"
              >
                <Link
                  href={item.href}
                  className="selected-work__card group"
                  aria-label={`${item.title}. ${item.role}. Open details.`}
                >
                  <span className="selected-work__index" aria-hidden="true">
                    {n}
                  </span>
                  <div className="selected-work__card-body">
                    <p className="selected-work__org">{item.eyebrow}</p>
                    <h3 className="selected-work__card-title">{item.title}</h3>
                    <p className="selected-work__context">{item.context}</p>
                    <div className="selected-work__meta">
                      <span className="selected-work__role">{item.role}</span>
                      <span className="selected-work__go" aria-hidden="true">
                        <span className="selected-work__go-label">View</span>
                        <ArrowUpRight className="selected-work__arrow h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={
            inView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: shouldReduceMotion ? 0 : 12 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : dur.md,
            delay: shouldReduceMotion ? 0 : 0.45,
            ease: cineEase,
          }}
          className="selected-work__footer"
        >
          <Link href="/evidence" className="selected-work__cta group">
            Read how I work
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-[var(--dur-apple-sm)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
