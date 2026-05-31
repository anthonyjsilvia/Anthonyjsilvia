"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";

// NodeDa — projects and former clients, shown as buttons in Experience
const NODEDA_PROJECTS = [
  { name: "Kinlily", href: "https://kinlily.com", ariaLabel: "Visit Kinlily (opens in new tab)" },
];
const NODEDA_FORMER_CLIENTS = [
  { name: "Rohde Architects", href: "https://rohdearchitects.com", ariaLabel: "Visit Rohde Architects (opens in new tab)" },
];

/* ---------------------------------------------------------------------------
   Smart, real-time tenure math
   ---------------------------------------------------------------------------
   Roles are stored as `start`/`end` month-year pairs instead of hand-written
   "(3 years 8 months)" strings, and the rendered period + company-total
   strings are computed from those pairs against a live "now" clock that
   re-ticks every minute. That means the page never goes stale: the day a
   month rolls over, the duration string updates on its own — no manual edit
   needed when, say, "1 month" should become "2 months".
   --------------------------------------------------------------------------- */

/** Lightweight month/year pair. Day-precision isn't needed for tenure math. */
type MonthYear = { year: number; month: number /* 1 = Jan, 12 = Dec */ };

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonthYear(my: MonthYear): string {
  return `${MONTH_NAMES[my.month - 1]} ${my.year}`;
}

function monthYearFromDate(d: Date): MonthYear {
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function compareMonthYear(a: MonthYear, b: MonthYear): number {
  return (a.year - b.year) * 12 + (a.month - b.month);
}

/**
 * Months between two MonthYears, counted *inclusively* — i.e. the start
 * month and the end month each count as one. This is the same convention
 * LinkedIn uses (e.g. Feb 2019 – Sep 2022 reads as "3 yrs 8 mos", not "3
 * yrs 7 mos"). Clamped to a minimum of 1 so a brand-new role reads as
 * "1 month" rather than "0 months".
 */
function diffMonthsInclusive(start: MonthYear, end: MonthYear): number {
  const raw = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  return Math.max(raw, 1);
}

/**
 * Convert a month count to the human-readable tenure string LinkedIn uses:
 *   12 → "1 year"
 *   13 → "1 year 1 month"
 *   24 → "2 years"
 *   44 → "3 years 8 months"
 *    1 → "1 month"
 */
function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (rem > 0) parts.push(`${rem} month${rem === 1 ? "" : "s"}`);
  if (parts.length === 0) parts.push("1 month");
  return parts.join(" ");
}

/**
 * Live "now" clock — returns the current Date and re-renders the consumer
 * every `intervalMs`. SSR-safe: the initial value uses the server's clock
 * (so the first paint already has a sensible string), and the effect
 * immediately re-syncs to the client's clock on mount.
 *
 * One minute is generous resolution for month-boundary updates, but it
 * also means that if you leave the tab open at 11:59 PM on the last day
 * of the month, "(X months)" will tick forward within ~60s of midnight.
 */
function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

type Role = {
  title: string;
  /** First month of the role (inclusive). */
  start: MonthYear;
  /** Last month of the role (inclusive). Omit for "Present". */
  end?: MonthYear;
  location: string;
  bullets?: string[];
  description?: string;
};

type ExperienceEntry = {
  company: string;
  roles: Role[];
};

// EXACT LinkedIn Experience entries — bullet copy is word-for-word; only the
// date math is now derived (so "(3 years 8 months)" etc. are computed live
// against the current date instead of hardcoded).
const experiences: ExperienceEntry[] = [
  {
    company: "Lowe's Companies, Inc.",
    roles: [
      {
        title: "Product Designer",
        start: { year: 2026, month: 5 },
        location: "Charlotte, North Carolina · Hybrid",
        bullets: [
          "Own end-to-end design for critical internal systems, leading discovery, interaction design, prototyping, usability validation, and iterative improvements across high-volume operational workflows.",
          "Partner with product, engineering, business stakeholders, and end users to translate complex operational needs into scalable, accessible, and business-aligned product experiences.",
          "Plan and facilitate usability testing and design validation, synthesizing research insights into actionable recommendations that inform roadmap priorities and product strategy.",
          "Drive product experience quality by identifying usability gaps, evaluating design tradeoffs, and supporting accessible solutions from concept through implementation.",
        ],
      },
      {
        title: "Associate Product Designer",
        start: { year: 2022, month: 10 },
        end: { year: 2026, month: 5 },
        location: "Charlotte Metro · Hybrid",
        bullets: [
          "Led the end-to-end design and iteration of critical internal systems, partnering with product and engineering to improve usability, operational efficiency, and business outcomes in high-volume environments.",
          "Planned and facilitated usability testing, translating research insights into prioritized product improvements adopted across the roadmap.",
          "Created wireframes and interactive prototypes in Figma to define product direction, validate concepts, and align cross-functional stakeholders on solutions.",
          "Contributed to and evolved internal design systems with an accessibility-first approach, supporting scalable product development and consistent user experiences.",
          "Designed within WCAG 2.2 AA/AAA standards while balancing accessibility, technical constraints, and operational priorities.",
        ],
      },
      {
        title: "Earlier Roles",
        start: { year: 2019, month: 2 },
        end: { year: 2022, month: 9 },
        location: "United States",
        description: "Proactively took ownership of customer facing work and operational responsibilities, developing a deep understanding for store workflow, system limitations, and real world constraints. This foundation, directly informs my approach, designing practical, enterprise-scale tools.",
      },
    ],
  },
  {
    company: "NodeDa",
    roles: [
      {
        title: "Principal Consultant",
        start: { year: 2017, month: 5 },
        location: "United States",
        bullets: [
          "Founded NodeDa, an independent product design consultancy providing selective design and product strategy support to small businesses and early-stage products.",
          "Lead end-to-end product design engagements, from discovery and user research through wireframes, prototypes, and delivery-ready design assets.",
          "Developed and launched an independent iOS application (Kinlily, formerly Cookbook), gaining hands-on experience in product lifecycle ownership, iteration, and user engagement.",
        ],
      },
    ],
  },
];

/**
 * Pretty period label for a single role, e.g.
 *   "May 2026 - Present (1 month)"
 *   "October 2022 - May 2026 (3 years 8 months)"
 */
function getRolePeriodLabel(role: Role, nowMy: MonthYear): string {
  const startLabel = formatMonthYear(role.start);
  const endLabel = role.end ? formatMonthYear(role.end) : "Present";
  const effectiveEnd = role.end ?? nowMy;
  const duration = formatDuration(diffMonthsInclusive(role.start, effectiveEnd));
  return `${startLabel} - ${endLabel} (${duration})`;
}

/**
 * Cumulative tenure at a company, derived from its earliest role start to
 * either "now" (if any role is ongoing) or the latest closed-out role end.
 * Returns just the duration ("7 years 4 months") since the header already
 * shows the company name above it.
 */
function getCompanyTotalLabel(exp: ExperienceEntry, nowMy: MonthYear): string {
  const earliestStart = exp.roles
    .map((r) => r.start)
    .reduce((a, b) => (compareMonthYear(a, b) <= 0 ? a : b));
  const anyOngoing = exp.roles.some((r) => !r.end);
  const latestEnd = anyOngoing
    ? nowMy
    : exp.roles
        .map((r) => r.end!)
        .reduce((a, b) => (compareMonthYear(a, b) >= 0 ? a : b));
  return formatDuration(diffMonthsInclusive(earliestStart, latestEnd));
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  // Live "now" — drives every duration string on the page so they tick over
  // on their own at month boundaries.
  const nowMy = monthYearFromDate(useNow());

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="experience-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Experience
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-16">
          {experiences.map((exp, expIndex) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              transition={{ delay: expIndex * 0.2, duration: shouldReduceMotion ? 0 : 0.6 }}
            >
              <Tilt3D
                max={4}
                lift={14}
                scale={1.005}
                className="card-3d bg-white dark:bg-black p-8 md:p-10 rounded-2xl border border-[var(--border-light)]"
              >
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4" style={{ transform: "translateZ(18px)" }}>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2 flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[var(--primary)] drop-shadow-md" aria-hidden="true" />
                      {exp.company}
                    </h3>
                    <p
                      className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-lg"
                      aria-live="polite"
                    >
                      {getCompanyTotalLabel(exp, nowMy)}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 mt-8">
                  {exp.roles.map((role, roleIndex) => (
                    <div
                      key={`${role.title}-${roleIndex}`}
                      className={roleIndex > 0 ? "pt-8 border-t border-[var(--border-light)]" : ""}
                    >
                      <h4 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        {role.title}
                      </h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span aria-live="polite">{getRolePeriodLabel(role, nowMy)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          <MapPin className="w-4 h-4" aria-hidden="true" />
                          <span>{role.location}</span>
                        </div>
                      </div>

                      {role.bullets && (
                        <ul className="space-y-3 mt-4">
                          {role.bullets.map((bullet, bulletIndex) => (
                            <li
                              key={bulletIndex}
                              className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] flex items-start gap-3 leading-relaxed"
                            >
                              <span
                                className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {role.description && (
                        <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed mt-4">
                          {role.description}
                        </p>
                      )}
                    </div>
                  ))}

                {exp.company === "NodeDa" && (
                  <>
                    <div className="pt-8 border-t border-[var(--border-light)]">
                      <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        Projects
                      </h4>
                      <div className="flex flex-wrap gap-3" style={{ transform: "translateZ(20px)" }}>
                        {NODEDA_PROJECTS.map((project) => (
                          <a
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={project.ariaLabel}
                            className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-[var(--border-light)]">
                      <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        Former clients
                      </h4>
                      <div className="flex flex-wrap gap-3" style={{ transform: "translateZ(20px)" }}>
                        {NODEDA_FORMER_CLIENTS.map((project) => (
                          <a
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={project.ariaLabel}
                            className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
