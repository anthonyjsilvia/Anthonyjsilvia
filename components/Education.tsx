"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { GraduationCap, Calendar, Trophy } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";
import GlowLink from "@/components/GlowLink";

type CollegeEntry = {
  institution: string;
  degree: string;
  period: string;
  description?: string;
};

// EXACT LinkedIn Education entries - word-for-word (college only)
const education: CollegeEntry[] = [
  {
    institution: "Southern New Hampshire University",
    degree: "Master of Business Administration (MBA)",
    period: "Aug 2025 - Sep 2026",
  },
  {
    institution: "Southern New Hampshire University",
    degree: "Bachelors, Graphic Design and Media Arts, Minoring in User Experience Design",
    period: "May 2022 - Aug 2024",
  },
];

// Honors earned during Bachelor's at SNHU (badge images) - Honor Roll count is pre-2025 only
const bachelorsHonors = [
  { name: "Dean's List", date: "May 2024", badge: "/awards/deans-list-SNHU.png" },
  { name: "President's List", date: "Sep 2023", badge: "/awards/Presidents-list-SNHU.png" },
  { name: "Honor Roll", date: "8 times", badge: "/awards/honor-role-SNHU.png" },
];

// Honors earned during Master's at SNHU (badge images). Like the Bachelor's
// Honor Roll, we summarize a recurring honor by count instead of a single
// date so the badge reads as "earned multiple times" rather than as a
// one-off in November.
const mastersHonors = [
  { name: "Honor Roll", date: "5 times", badge: "/awards/honor-role-SNHU.png" },
];

const MERIT_PAGES_URL = "https://meritpages.com/anthonysilvia";
const BACHELORS_DIPLOMA_URL = "https://www.parchment.com/u/award/917e24e9b7910565b7671dcdaa09e483";
const MBA_DIPLOMA_URL = "https://www.parchment.com/lp/award/16c41a94-e2c5-473c-a2af-b3839b78248c";
const BACHELORS_CONFERRED = "September 1, 2024";
const MBA_CONFERRED = "October 1, 2026";

/**
 * SNHU official brand palette - mirrors the colors used inside SNHU.svg
 * (Ink Blue shield + flame gold + brand bright blue). Sourced from the SNHU
 * brand identity guide and verified against the logo file.
 */
const SNHU_BRAND = {
  ink: "#00254F",
  inkDeep: "#00193A",
  gold: "#FEB913",
  goldDeep: "#E5A50F",
  brightBlue: "#009DEA",
  shadow: "rgba(0, 14, 36, 0.55)",
} as const;

export default function Education({
  collegeEntries,
}: {
  /** Live college rows from NodeDa Resume embed API. Falls back to static copy. */
  collegeEntries?: CollegeEntry[] | null;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const collegeList =
    collegeEntries && collegeEntries.length > 0 ? collegeEntries : education;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
      },
    },
  };

  return (
    <section
      id="education"
      ref={ref}
      className="hp-cine-stage bg-[var(--bg-secondary)]"
      aria-labelledby="education-heading"
    >
      <div className="w-full max-w-[var(--hp-cine-max)] mx-auto">
        <motion.div
          className="mb-12 md:mb-16 max-w-3xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Background
          </p>
          <h2
            id="education-heading"
            className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
          >
            Education
          </h2>
        </motion.div>

        {/* Education Entries - college only in grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collegeList.map((edu, index) => {
              const degreeLower = edu.degree.toLowerCase();
              const isSnhu = /southern new hampshire/i.test(edu.institution);
              const isBachelors =
                isSnhu &&
                (degreeLower.includes("bachelor") || degreeLower.includes("bachelors"));
              const isMasters =
                isSnhu &&
                (degreeLower.includes("master") ||
                  degreeLower.includes("mba") ||
                  degreeLower.includes("masters"));
              const honors = isBachelors ? bachelorsHonors : isMasters ? mastersHonors : null;
              const conferredDate = isMasters
                ? MBA_CONFERRED
                : isBachelors
                  ? BACHELORS_CONFERRED
                  : null;
              return (
              <motion.div
                key={`${edu.institution}-${index}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Tilt3D
                  max={5}
                  lift={16}
                  scale={1.01}
                  containerClassName="h-full"
                  // `h-full` here is critical: it makes Tilt3D's inner motion
                  // wrapper stretch to fill the outer container, which in turn
                  // lets the <article>'s `h-full` propagate all the way down.
                  // Without it the inner wrapper collapses to content height
                  // and the Master's card ends up shorter than the Bachelor's
                  // (which has 3 honors badges + a longer degree title).
                  className="card-3d rounded-2xl h-full"
                >
                  <article
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${SNHU_BRAND.ink} 0%, ${SNHU_BRAND.inkDeep} 100%)`,
                      boxShadow: `0 24px 48px -16px ${SNHU_BRAND.shadow}, inset 0 0 0 1px ${SNHU_BRAND.gold}26`,
                    }}
                  >
                    {/* Subtle inner gold frame - diploma-style mat board */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-[1.25rem]"
                      style={{ border: `1px solid ${SNHU_BRAND.gold}26` }}
                    />

                    {/* Diagonal glint - faint light catch across the navy field */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
                      style={{
                        background: `linear-gradient(115deg, transparent 38%, ${SNHU_BRAND.gold} 50%, transparent 62%)`,
                      }}
                    />

                    {/* Conferral date pill - shown on both SNHU degree cards */}
                    {conferredDate && (
                      <div
                        className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em] font-semibold"
                        style={{
                          color: SNHU_BRAND.gold,
                          background: `${SNHU_BRAND.gold}1A`,
                          border: `1px solid ${SNHU_BRAND.gold}66`,
                        }}
                        aria-label={`Conferred ${conferredDate}`}
                      >
                        <GraduationCap className="h-3 w-3" aria-hidden="true" />
                        <span>Conferred {conferredDate}</span>
                      </div>
                    )}

                    <div className="relative flex h-full flex-col p-7 sm:p-8">
                      {/* SNHU brand seal - sits directly on the navy card.
                          The official SNHU.svg lockup is already navy-shield
                          + gold flame + white wordmark, so on a navy card it
                          reads as an emblem inlaid into the card itself
                          rather than a sticker pasted on top. No background
                          plate needed (and no inner shadow / chrome). */}
                      <div
                        className="mb-6 inline-flex h-14 sm:h-16 w-fit items-center justify-center"

                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/schools/SNHU.svg"
                          alt="Southern New Hampshire University"
                          className="h-full w-auto object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <h3 className="text-2xl font-bold text-white leading-tight mb-3 pr-24">
                        {isMasters
                          ? "Master of Business Administration (MBA)"
                          : edu.degree || edu.institution}
                      </h3>

                      {/* Hairline gold accent - varsity badge motif */}
                      <div
                        aria-hidden="true"
                        className="h-px w-10 mb-3"
                        style={{ background: SNHU_BRAND.gold, opacity: 0.6 }}
                      />

                      <div
                        className="flex items-center gap-2 text-sm font-medium mb-6"
                        style={{ color: "rgba(255, 255, 255, 0.82)" }}
                      >
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>{edu.period}</span>
                      </div>

                      {edu.description ? (
                        <p
                          className="text-sm leading-relaxed mb-6"
                          style={{ color: "rgba(255, 255, 255, 0.78)" }}
                        >
                          {edu.description}
                        </p>
                      ) : null}

                      {honors && (
                        <div
                          className="rounded-xl p-5 mb-6"
                          style={{
                            background: "rgba(255, 255, 255, 0.06)",
                            border: `1px solid ${SNHU_BRAND.gold}33`,
                            backdropFilter: "blur(2px)",
                          }}
                        >
                          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] mb-4" style={{ color: SNHU_BRAND.gold }}>
                            <Trophy className="w-4 h-4" aria-hidden="true" />
                            Honors earned
                          </h4>
                          <ul className="flex flex-wrap items-end gap-5" role="list">
                            {honors.map((honor) => (
                              <li key={`${honor.name}-${honor.date}`} className="flex flex-col items-center gap-1.5">
                                <a
                                  href={MERIT_PAGES_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#00193A]"
                                  style={{ "--tw-ring-color": `${SNHU_BRAND.gold}99` } as React.CSSProperties}
                                  aria-label={`${honor.name}, ${honor.date} - View on Merit Pages`}
                                >
                                  <Image
                                    src={honor.badge}
                                    alt=""
                                    width={96}
                                    height={96}
                                    className="object-contain"
                                  />
                                </a>
                                <span className="text-[11px] font-medium text-center" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                                  {honor.date}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(isBachelors || isMasters) && (
                        <div className="mt-auto flex justify-center">
                          {isBachelors && (
                            <GlowLink
                              href={BACHELORS_DIPLOMA_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="primary"
                              className="px-5 py-2.5 rounded-lg font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#00193A]"
                              style={{
                                background: SNHU_BRAND.gold,
                                color: SNHU_BRAND.ink,
                                boxShadow: `0 8px 20px -8px ${SNHU_BRAND.gold}80, inset 0 -2px 0 0 ${SNHU_BRAND.goldDeep}`,
                                "--tw-ring-color": `${SNHU_BRAND.gold}99`,
                              } as React.CSSProperties}
                              aria-label="View Bachelor's diploma on Parchment (opens in new tab)"
                            >
                              View diploma
                            </GlowLink>
                          )}
                          {isMasters && (
                            <GlowLink
                              href={MBA_DIPLOMA_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="primary"
                              className="px-5 py-2.5 rounded-lg font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#00193A]"
                              style={{
                                background: SNHU_BRAND.gold,
                                color: SNHU_BRAND.ink,
                                boxShadow: `0 8px 20px -8px ${SNHU_BRAND.gold}80, inset 0 -2px 0 0 ${SNHU_BRAND.goldDeep}`,
                                "--tw-ring-color": `${SNHU_BRAND.gold}99`,
                              } as React.CSSProperties}
                              aria-label="View MBA diploma on Parchment (opens in new tab)"
                            >
                              View diploma
                            </GlowLink>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Tilt3D>
              </motion.div>
            );
            })}
          </div>
        </div>

        {/* High school omitted: college + MBA only for senior hiring screens */}

      </div>
    </section>
  );
}
