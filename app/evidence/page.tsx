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
          "Assisted with research scheduling so the team could run studies with stores and associates; kept scheduling and prep within the timeline so design decisions for the return space were grounded in real feedback.",
          "Designed experiences for specific return-space scenarios related to reducing shrink and return fraud (scenario details confidential); scoped work to those scenarios to protect launch goals and compliance and avoid broadening scope in ways that would delay delivery.",
          "Assisted with library creation and component positioning for the return-space UI; invested in structure and reuse so that future scenarios and flows could be built consistently without rework.",
        ],
      },
      {
        name: PROJECT_B_TRADE_OFFS,
        bullets: [
          "Compromised with leadership on scope and timeline so we could ship a first release that met business goals while leaving room to iterate; kept the focus on the highest-impact flows so users got a stable, usable product sooner.",
          "Worked with developers to align on technical constraints and feasibility; made trade-offs between ideal UX and build complexity so the experience stayed strong without blocking delivery or overloading the team.",
          "Aligned with other stakeholders (operations, vendors, finance) on priorities and language; made small concessions in wording and sequence so the final product reflected one shared model and gave users a consistent, clear experience.",
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
          "Some functionalities for that vertical lived only in the legacy system during my tenure; designed a dashboard layout that surfaced and linked to those legacy capabilities so associates had one place to work while the organization transitioned.",
          "Usability had to be maintained for specific tender types despite differing workflows; structured the experience around tender type so each path stayed clear and consistent without forcing one flow for all.",
          "Payments and where they were headed were unclear; worked with third parties to clarify and surface payment destinations and flow in the UI so associates and customers could see where payments were going.",
        ],
      },
      {
        name: PROJECT_B_COMPLEXITY,
        bullets: [
          "Upgraded from AI-generated designs to Figma; the transition gave the team a single, structured source of truth and made it easier to iterate and hand off.",
          "Figma improved clarity for developers: they could see components, layers, and specs in one place and understand the flow more easily than with the previous AI-generated outputs.",
          "With flows and screens in Figma, alignment between design and development improved so the built product matched intent and reduced back-and-forth.",
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
          "Requirements for “improved customer experience” in the return space were vague; ran short discovery interviews with associates and managers to define “improved” as faster processing and fewer callbacks. Turned that into measurable success criteria.",
          "It was unclear which return reasons drove the most volume and pain; pulled a sample of real return data and paired it with a few store visits to validate which codes to keep and how to order them in the UI.",
          "Stakeholders disagreed on whether to optimize for speed vs. accuracy; framed a trade-off with scenarios (e.g., “if we add one more confirmation step, we add X seconds per return”) and got alignment on accuracy-first with a time target.",
        ],
      },
      {
        name: PROJECT_B_AMBIGUITY,
        bullets: [
          "Defined flows into two patterns, linear and non-linear; made it easy to show users what the product can do while giving them the flexibility to complete objectives in fewer steps when they want to move faster.",
          "Structured the experience so both patterns were clear: linear for guided, step-by-step use and non-linear for users who already know the path; this reduced ambiguity about how to accomplish tasks and supported different ways of working.",
          "Challenged leadership on how the feature should work when the proposed approach didn't best serve users; did it in a professional manner so we could align on a solution that balanced business goals with a better experience.",
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
          "Return Space fed data into vendor reconciliation and finance; involved those teams early so label format and reason-code values matched downstream systems and we avoided rework after launch.",
          "Changes to the return flow affected training and store communications; aligned with the training team on a single “source of truth” flow so store guides and UI stayed in sync.",
          "Designed with future RTV centralization in mind (e.g., consistent reason codes and status language) so that when Centralized RTV was built, the Return Space model could be extended rather than replaced.",
        ],
      },
      {
        name: PROJECT_B_SYSTEMS,
        bullets: [
          "Adopted the internal design system for Pro Supply; gave DABS the flexibility to keep using the existing noncompliant system until the transition could fully occur, so we could move forward without blocking other teams.",
          "Used the design system to shape and build the components for the chatbot experience we wanted; having a shared component set let us design and spec the flow in one place and keep the experience consistent.",
          "This approach enabled developers to move faster: they could understand the flow from the design system and create or extend components as needed, which sped up development and kept the chatbot build on track.",
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
          "Gained leadership experience by compromising with developers and PMs instead of only designing in isolation; learned to align on scope, feasibility, and language so we could ship a better experience without blocking each other.",
          "Shifted from user experience design exclusively to managing projects: in Pro Supply I created tickets and owned backlog items to alleviate pressure on my PMs, so design and delivery stayed moving without bottlenecking on one role.",
          "Adopted a design-system and component-driven approach: adopting the internal design system and shaping components for the chatbot let developers understand the flow and build faster, which I carried forward as a way to scale impact beyond pixel-level design.",
          "Learned to challenge leadership on how features should work when the proposed approach didn't best serve users, and to do it in a professional way so we could land on solutions that balanced business goals with a better experience.",
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
            Portfolio
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]">
            Evidence
          </h1>
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
          />
          <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.15rem] md:leading-[1.75]">
            How I work, drawn from two projects: <strong>{PROJECT_A}</strong> and{" "}
            <strong>Lowe&apos;s Pro Supply</strong>. Short, evidence-based bullets on
            trade-offs, clarity, ambiguity, systems, and what changed between them.
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
