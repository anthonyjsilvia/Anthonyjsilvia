"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import GlowLink from "@/components/GlowLink";
import type { MappedExperienceEntry, MappedProject } from "@/lib/resume-public";

// NodeDa - projects and former clients, shown as buttons in Experience
// (used when the live API does not supply project links for NodeDa).
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
   month rolls over, the duration string updates on its own - no manual edit
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
 * Months between two MonthYears, counted *inclusively* - i.e. the start
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
 * Live "now" clock - returns the current Date and re-renders the consumer
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
  projects?: { name: string; href: string; ariaLabel: string }[];
};

// EXACT LinkedIn Experience entries - bullet copy is word-for-word; only the
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
        title: "Product Designer",
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

export default function Experience({
  entries,
  projects,
  summary,
}: {
  /** Live entries from NodeDa Resume embed API. Falls back to static LinkedIn copy. */
  entries?: MappedExperienceEntry[] | null;
  /** Live projects from the API (shown as their own card when present). */
  projects?: MappedProject[] | null;
  /** Optional About/summary from profile.basics */
  summary?: string | null;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  // Live "now" - drives every duration string on the page so they tick over
  // on their own at month boundaries.
  const nowMy = monthYearFromDate(useNow());
  const list = useMemo(
    () => (entries && entries.length > 0 ? entries : experiences),
    [entries],
  );
  const apiProjects = useMemo(
    () => (projects && projects.length > 0 ? projects : null),
    [projects],
  );

  return (
    <section
      id="experience"
      ref={ref}
      className="hp-cine-stage bg-[var(--background)]"
      aria-labelledby="experience-heading"
    >
      <div className="w-full max-w-[var(--hp-cine-max)] mx-auto">
        <motion.div
          className="mb-12 md:mb-16 max-w-3xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Career
          </p>
          <h2
            id="experience-heading"
            className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
          >
            Experience
          </h2>
          {summary?.trim() ? (
            <p className="mt-5 text-[clamp(1.05rem,1.5vw,1.2rem)] font-medium leading-[1.55] text-[var(--text-secondary)]">
              {summary.trim()}
            </p>
          ) : null}
        </motion.div>

        <div className="space-y-10 md:space-y-14">
          {list.map((exp, expIndex) => {
            const isNodeDa = /nodeda/i.test(exp.company);
            // Site enrichment when the live snapshot has no projects yet.
            const projectLinks =
              !apiProjects && isNodeDa ? NODEDA_PROJECTS : null;
            return (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
              transition={{ delay: shouldReduceMotion ? 0 : expIndex * 0.08, duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="border-t border-[var(--border-light)] pt-8 md:pt-10">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.03em] text-[var(--text-primary)] mb-2 flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                      {exp.company}
                    </h3>
                    <p
                      className="text-[var(--text-secondary)] text-base md:text-lg font-medium"
                      aria-live="polite"
                    >
                      {getCompanyTotalLabel(exp, nowMy)}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 mt-6">
                  {exp.roles.map((role, roleIndex) => (
                    <div
                      key={`${role.title}-${roleIndex}`}
                      className={roleIndex > 0 ? "pt-8 border-t border-[var(--border-light)]" : ""}
                    >
                      <h4 className="text-lg md:text-xl font-bold tracking-[-0.02em] text-[var(--text-primary)] mb-4">
                        {role.title}
                      </h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span aria-live="polite">{getRolePeriodLabel(role, nowMy)}</span>
                        </div>
                        {role.location ? (
                          <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span>{role.location}</span>
                          </div>
                        ) : null}
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
                        <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed mt-4 whitespace-pre-line">
                          {role.description}
                        </p>
                      )}
                    </div>
                  ))}

                {projectLinks && (
                  <>
                    <div className="pt-8 border-t border-[var(--border-light)]">
                      <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        Projects
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {projectLinks.map((project) => (
                          <GlowLink
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={project.ariaLabel}
                            variant="primary"
                            className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </GlowLink>
                        ))}
                      </div>
                    </div>
                    {isNodeDa ? (
                      <div className="pt-6 border-t border-[var(--border-light)]">
                        <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                          Former clients
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {NODEDA_FORMER_CLIENTS.map((project) => (
                            <GlowLink
                              key={project.name}
                              href={project.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={project.ariaLabel}
                              variant="primary"
                              className="px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                            >
                              {project.name}
                              <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            </GlowLink>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
                </div>
              </article>
            </motion.div>
            );
          })}

          {apiProjects ? (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
              transition={{ delay: shouldReduceMotion ? 0 : list.length * 0.08, duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="border-t border-[var(--border-light)] pt-8 md:pt-10">
                <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-[-0.03em] text-[var(--text-primary)] mb-6 flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                  Projects
                </h3>
                <ul className="space-y-6" role="list">
                  {apiProjects.map((project) => (
                    <li key={project.name} className="border-t border-[var(--border-light)] pt-6 first:border-t-0 first:pt-0">
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={project.ariaLabel}
                          className="inline-flex items-center gap-2 text-xl font-bold text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] rounded"
                        >
                          {project.name}
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      ) : (
                        <p className="text-xl font-bold text-[var(--text-primary)]">{project.name}</p>
                      )}
                      {project.description ? (
                        <p className="mt-2 text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                          {project.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
