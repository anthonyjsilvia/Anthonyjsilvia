"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

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

export default function EvidencePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-white dark:bg-black">
        <a href="#main-content" className="skip-link" aria-label="Skip to main content">
          Skip to main content
        </a>

        {/* Same horizontal inset as nav (left-4 right-4 → px-4 sm:px-5); max-w-7xl matches Experience/Portfolio */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 mt-6 py-16 md:py-24">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-[var(--primary)] dark:text-[var(--primary)] font-medium mb-12 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded px-1 py-0.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to portfolio
            </Link>

            <header className="mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                Evidence
              </h1>
              <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-3xl">
                How I work, drawn from two projects: <strong>{PROJECT_A}</strong> and{" "}
                <strong>Lowe's Pro Supply</strong>. Short, evidence-based bullets on trade-offs,
                clarity, ambiguity, systems, and what changed between them.
              </p>
            </header>

            <nav aria-label="Page sections" className="mb-16">
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded px-2 py-1"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-20">
              {sections.map((section, sectionIndex) => {
                const isTwoColumn = section.projects.length >= 2 && section.projects.every((p) => p.name === PROJECT_A || p.name === PROJECT_B || p.name === PROJECT_B_TRADE_OFFS || p.name === PROJECT_B_COMPLEXITY || p.name === PROJECT_B_AMBIGUITY || p.name === PROJECT_B_SYSTEMS);
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                    transition={{ duration: 0.4, delay: sectionIndex * 0.08 }}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2">
                      {section.title}
                    </h2>
                    <div className="w-16 h-1 bg-[var(--primary)] rounded-full mb-6" />
                    <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-10 max-w-3xl">
                      {section.intro}
                    </p>

                    <div
                      className={
                        isTwoColumn
                          ? "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12"
                          : "space-y-10"
                      }
                    >
                      {section.projects.map((project) => (
                        <div key={project.name} className="min-w-0">
                          <h3 className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                            {project.name}
                          </h3>
                          <ul className="space-y-3 list-none pl-0">
                            {project.bullets.map((bullet, i) => (
                              <li
                                key={i}
                                className="flex gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed"
                              >
                                <span
                                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 bg-[var(--primary)]"
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

            <footer className="mt-24 pt-8 border-t border-[var(--border-light)]">
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-[var(--primary)] dark:text-[var(--primary)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded px-1 py-0.5"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to portfolio
              </Link>
            </footer>
          </motion.div>
        </div>
      </main>
    </>
  );
}
