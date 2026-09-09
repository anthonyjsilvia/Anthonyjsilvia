"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import SiteBackBar from "@/components/SiteBackBar";

const PROJECT_A = "Lowe's Return Space";
const PROJECT_B = "Lowe's Centralized Return to Vendor";
/** Trade-offs section only: returns in Pro Supply */
const PROJECT_B_TRADE_OFFS = "Returns in Lowe's Pro Supply";
/** Complexity → Clarity section only: Pro Supply */
const PROJECT_B_COMPLEXITY = "Lowe's Pro Supply";
/** Ambiguity section only: Pro Supply */
const PROJECT_B_AMBIGUITY = "Lowe's Pro Supply";
/** Systems Thinking section only: Pro Supply */
const PROJECT_B_SYSTEMS = "Lowe's Pro Supply";

const TWO_COLUMN_NAMES = new Set([
  PROJECT_A,
  PROJECT_B,
  PROJECT_B_TRADE_OFFS,
  PROJECT_B_COMPLEXITY,
  PROJECT_B_AMBIGUITY,
  PROJECT_B_SYSTEMS,
]);

const sections = [
  {
    id: "trade-offs",
    title: "Trade-offs",
    intro:
      "Decisions where something was cut, reduced, or changed, and what outcome that protected or enabled.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Prioritized research scheduling so the team could run studies with stores and associates on timeline; kept prep grounded so design decisions for the return space were validated with real feedback.",
          "Scoped experiences to specific return-space scenarios tied to reducing shrink and return fraud (details confidential); protected launch goals and compliance instead of broadening scope that would delay delivery.",
          "Invested in library creation and component positioning for the return-space UI so future scenarios could reuse structure without rework.",
        ],
      },
      {
        name: PROJECT_B_TRADE_OFFS,
        bullets: [
          "Aligned with leadership on scope and timeline so we could ship a first release that met business goals while leaving room to iterate; prioritized highest-impact flows for a stable, usable product sooner.",
          "Partnered with developers on technical constraints; traded ideal UX against build complexity so the experience stayed strong without blocking delivery.",
          "Aligned operations, vendors, and finance on priorities and language; small concessions in wording and sequence produced one shared model and a consistent experience for users.",
        ],
      },
    ],
  },
  {
    id: "complexity-clarity",
    title: "Complexity → Clarity",
    intro:
      "How messy or complicated situations were simplified with structure or systems.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Some capabilities still lived only in the legacy system; designed a dashboard that surfaced and linked those paths so associates had one place to work during the transition.",
          "Structured the experience around tender type so differing workflows stayed clear without forcing one flow for all.",
          "Clarified payment destinations with third parties and surfaced flow in the UI so associates and customers could see where payments were going.",
        ],
      },
      {
        name: PROJECT_B_COMPLEXITY,
        bullets: [
          "Moved the team from AI-accelerated drafts to Figma as the production source of truth - using AI for speed, then structure for handoff, iteration, and developer clarity.",
          "Gave developers components, layers, and specs in one place so flows were clearer than raw AI-generated outputs alone.",
          "With flows and screens in Figma, design and development stayed aligned so the built product matched intent and reduced rework.",
        ],
      },
    ],
  },
  {
    id: "ambiguity",
    title: "Ambiguity",
    intro:
      "How unclear or undefined problems were handled: what was unknown, how assumptions were validated, and what created direction.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Defined success criteria when “improved customer experience” was vague: ran short discovery interviews with associates and managers, framed “improved” as faster processing and fewer callbacks, and turned that into measurable goals.",
          "Validated which return reasons drove volume and pain: sampled real return data and paired it with store visits to decide which codes to keep and how to order them in the UI.",
          "Framed a speed-vs-accuracy trade-off with concrete scenarios for stakeholders and aligned on accuracy-first with a time target.",
        ],
      },
      {
        name: PROJECT_B_AMBIGUITY,
        bullets: [
          "Defined flows into linear and non-linear patterns so users could see what the product can do and still complete objectives in fewer steps when they already know the path.",
          "Structured both patterns clearly - guided step-by-step vs. expert shortcuts - reducing ambiguity about how to finish tasks.",
          "Challenged leadership when a proposed approach did not best serve users; kept the conversation professional so we could align on a balance of business goals and better experience.",
        ],
      },
    ],
  },
  {
    id: "systems-thinking",
    title: "Systems Thinking",
    intro:
      "Awareness of upstream and downstream impacts: how decisions affected other teams, steps, or metrics, and what was done for consistency or scalability.",
    projects: [
      {
        name: PROJECT_A,
        bullets: [
          "Involved vendor reconciliation and finance early so label format and reason-code values matched downstream systems and avoided rework after launch.",
          "Aligned with training on a single source-of-truth flow so store guides and UI stayed in sync when the return flow changed.",
          "Designed with future RTV centralization in mind (consistent reason codes and status language) so Centralized RTV could extend the Return Space model rather than replace it.",
        ],
      },
      {
        name: PROJECT_B_SYSTEMS,
        bullets: [
          "Adopted the internal design system for Pro Supply while giving DABS flexibility to keep the existing system until transition - progress without blocking other teams.",
          "Used the design system to shape chatbot components so the flow was designed and specified in one place and stayed consistent.",
          "Enabled developers to move faster from shared components: understand the flow, extend what they needed, and keep the chatbot build on track.",
        ],
      },
    ],
  },
  {
    id: "how-ive-changed",
    title: "How I've Changed",
    intro:
      "What I learned from Return Space, what I stopped doing, and what I adopted across Lowe's Pro Supply and related work.",
    projects: [
      {
        name: "Learning between the two",
        bullets: [
          "Gained leadership experience by aligning with developers and PMs on scope, feasibility, and language instead of designing in isolation - so we could ship without blocking each other.",
          "Expanded from UX craft into product delivery: in Pro Supply I created tickets and owned backlog items to alleviate pressure on PMs so design and delivery kept moving.",
          "Adopted a design-system and component-driven approach so developers could understand flows faster and impact scaled beyond pixel-level design.",
          "Learned to challenge leadership on feature direction when the proposed approach did not best serve users - professionally, so we landed on solutions that balanced business goals with better experience.",
        ],
      },
    ],
  },
];

/**
 * Evidence — cinematic editorial layout aligned with recommendation detail:
 * fixed back control, viewport-width stage, display typography, wide columns.
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
            Product experience in practice
          </h1>
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
          />
          <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.15rem] md:leading-[1.75]">
            How a Product Experience Manager works - problem framing, trade-offs,
            systems thinking, and delivery - drawn from{" "}
            <strong>{PROJECT_A}</strong> and{" "}
            <strong>Lowe&apos;s Pro Supply</strong>. Short, evidence-based bullets
            hiring managers can scan; confidential UI stays out of view.
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
                    <div key={project.name} className="min-w-0">
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
