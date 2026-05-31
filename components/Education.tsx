"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GraduationCap, Calendar, Trophy, X, Lightbulb, Clock } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";

// Easter egg: UX/PM tips when clicking "MBA candidate" (diploma in progress)
const MBA_EASTER_EGG_TIPS = [
  { quote: "Plans are nothing; planning is everything.", by: "Dwight D. Eisenhower", tag: "Project Management" },
  { quote: "Don't make me think.", by: "Steve Krug", tag: "UX" },
  { quote: "What gets measured gets managed.", by: "Peter Drucker", tag: "Project Management" },
  { quote: "Every click should have a reward. You just got one.", by: "UX principle", tag: "UX" },
  { quote: "The best time to plan was yesterday. The second best time is now.", by: "Proverb", tag: "Project Management" },
  { quote: "Design is not just what it looks like. Design is how it works.", by: "Steve Jobs", tag: "UX" },
];

// EXACT LinkedIn Education entries - word-for-word (college only; high school shown separately below)
const education = [
  {
    institution: "Southern New Hampshire University",
    degree: "Masters in Business Administration",
    period: "Aug 2025 - Sep 2026",
  },
  {
    institution: "Southern New Hampshire University",
    degree: "Bachelors, Graphic Design and Media Arts, Minoring in User Experience Design",
    period: "May 2022 - Aug 2024",
  },
];

/**
 * High schools rendered as brand-colored varsity badges.
 *
 * `logoSrc` is optional. If you drop an official logo PNG/SVG at the listed
 * path (transparent background works best), the badge will render it inside
 * the medallion. Otherwise we fall back to a typographic monogram so the
 * badge still ships looking intentional.
 */
type HighSchoolBadge = {
  institution: string;
  shortName: string;
  mascot: string;
  monogram: string;
  location: string;
  period: string;
  classOf?: string;
  degree?: string;
  websiteUrl: string;
  logoSrc?: string;
  colors: {
    bgFrom: string;
    bgTo: string;
    accent: string;
    ink: string;
    ringShadow: string;
  };
};

const highSchools: HighSchoolBadge[] = [
  {
    institution: "Wasilla High School",
    shortName: "Wasilla High",
    mascot: "Warriors",
    monogram: "WHS",
    location: "Wasilla, Alaska",
    period: "2015 – 2017",
    classOf: "Class of 2017",
    degree: "High School Diploma",
    websiteUrl: "https://whs.matsuk12.us/",
    logoSrc: "/schools/whs.svg",
    colors: {
      // Wasilla Warriors red — saturated, deep, classic athletic red
      bgFrom: "#C81E1E",
      bgTo: "#7E1313",
      accent: "#FFFFFF",
      ink: "#FFFFFF",
      ringShadow: "rgba(0, 0, 0, 0.45)",
    },
  },
  {
    institution: "South Anchorage High School",
    shortName: "South Anchorage High",
    mascot: "Wolverines",
    monogram: "SAHS",
    location: "Anchorage, Alaska",
    period: "Jun 2013 – Jun 2015",
    websiteUrl: "https://www.asdk12.org/south",
    logoSrc: "/schools/sahs.svg",
    colors: {
      // SAHS Wolverines black + Vegas gold
      bgFrom: "#0E0E0E",
      bgTo: "#1F1F1F",
      accent: "#D4AF6E",
      ink: "#E8D8B5",
      ringShadow: "rgba(0, 0, 0, 0.6)",
    },
  },
];

// Honors earned during Bachelor's at SNHU (badge images) — Honor Roll count is pre-2025 only
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
  { name: "Honor Roll", date: "3 times", badge: "/awards/honor-role-SNHU.png" },
];

const MERIT_PAGES_URL = "https://meritpages.com/anthonysilvia";
const BACHELORS_DIPLOMA_URL = "https://www.parchment.com/u/award/917e24e9b7910565b7671dcdaa09e483";

/**
 * SNHU official brand palette — mirrors the colors used inside SNHU.svg
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

/**
 * SchoolBadge — square varsity-style badge for a high school.
 *
 * The full card is a link to the school's website. Visually it reads as a
 * sports licensing / class-ring style emblem: brand-colored gradient field,
 * centered medallion (logo if available, monogram otherwise), mascot name,
 * and a year stamp at the bottom.
 */
function SchoolBadge({ school }: { school: HighSchoolBadge }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const showLogo = Boolean(school.logoSrc) && !logoFailed;
  const { colors } = school;
  const bottomLine = school.classOf
    ? `${school.classOf} · ${school.degree ?? ""}`.replace(/ · $/, "")
    : school.period;

  return (
    <Tilt3D
      max={shouldReduceMotion ? 0 : 4}
      lift={shouldReduceMotion ? 0 : 10}
      scale={shouldReduceMotion ? 1 : 1.005}
      className="card-3d rounded-3xl"
      containerClassName="h-full"
    >
      <a
        href={school.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${school.institution}, ${school.mascot}. ${school.period}. Opens school website in new tab.`}
        className="group relative block aspect-[5/1] w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] focus:ring-offset-2"
        style={{
          background: `linear-gradient(135deg, ${colors.bgFrom} 0%, ${colors.bgTo} 100%)`,
          boxShadow: `0 16px 32px -16px ${colors.ringShadow}, inset 0 0 0 1px ${colors.accent}22`,
          containerType: "inline-size",
        }}
      >
        {/* Subtle inner frame, like a varsity patch border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 rounded-[1rem]"
          style={{
            border: `1px solid ${colors.accent}33`,
          }}
        />

        {/* Diagonal glint, faintly catching the light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            background: `linear-gradient(115deg, transparent 38%, ${colors.accent} 50%, transparent 62%)`,
          }}
        />

        <div className="relative flex h-full w-full items-center gap-3 sm:gap-4 px-3 sm:px-4">
          {/* Medallion: real logo (bare) when available, otherwise typographic
              monogram inside a varsity bezel. SVG logos use a plain <img>
              instead of next/image because SVG isn't optimized by Next and
              would otherwise require `dangerouslyAllowSVG`. */}
          {showLogo ? (
            <div className="flex aspect-square h-[88%] flex-shrink-0 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={school.logoSrc!}
                alt={`${school.institution} logo`}
                width={120}
                height={120}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                style={{
                  filter: `drop-shadow(0 4px 8px ${colors.ringShadow})`,
                }}
                onError={() => setLogoFailed(true)}
              />
            </div>
          ) : (
            <div
              className="flex aspect-square h-[72%] flex-shrink-0 items-center justify-center rounded-full"
              style={{
                border: `1.5px solid ${colors.accent}`,
                background: `radial-gradient(circle at 30% 25%, ${colors.accent}22 0%, transparent 70%)`,
                boxShadow: `inset 0 0 0 2px ${colors.bgFrom}, 0 4px 12px -4px ${colors.ringShadow}`,
              }}
            >
              <span
                aria-hidden="true"
                className="font-black tracking-[0.04em] text-[clamp(0.7rem,2.2cqw,1.05rem)] leading-none"
                style={{ color: colors.accent }}
              >
                {school.monogram}
              </span>
            </div>
          )}

          {/* Mascot wordmark + school name */}
          <div className="flex min-w-0 flex-1 flex-col justify-center text-left">
            <p
              className="font-black uppercase tracking-[0.16em] leading-none text-[clamp(0.85rem,2.6cqw,1.35rem)] truncate"
              style={{ color: colors.accent }}
            >
              {school.mascot}
            </p>
            <p
              className="mt-1 font-semibold leading-tight text-[clamp(0.65rem,1.7cqw,0.85rem)] truncate"
              style={{ color: colors.ink }}
            >
              {school.shortName}
            </p>
          </div>

          {/* Year stamp — class ring style */}
          <div
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 uppercase tracking-[0.18em] font-semibold text-[clamp(0.55rem,1.4cqw,0.7rem)] leading-none"
            style={{
              color: colors.ink,
              background: `${colors.accent}1F`,
              border: `1px solid ${colors.accent}55`,
            }}
          >
            <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{bottomLine}</span>
          </div>
        </div>
      </a>
    </Tilt3D>
  );
}

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [mbaEasterEggOpen, setMbaEasterEggOpen] = useState(false);
  const [mbaEasterEggTip, setMbaEasterEggTip] = useState(MBA_EASTER_EGG_TIPS[0]);

  const openMbaEasterEgg = () => {
    setMbaEasterEggTip(MBA_EASTER_EGG_TIPS[Math.floor(Math.random() * MBA_EASTER_EGG_TIPS.length)]);
    setMbaEasterEggOpen(true);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMbaEasterEggOpen(false);
    };
    if (mbaEasterEggOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [mbaEasterEggOpen]);

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
      className="py-24 md:py-32 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      aria-labelledby="education-heading"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="education-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Education
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        {/* Education Entries — college only in grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => {
              const isBachelors = edu.institution === "Southern New Hampshire University" && edu.degree.includes("Bachelors");
              const isMasters = edu.institution === "Southern New Hampshire University" && edu.degree.includes("Masters");
              const honors = isBachelors ? bachelorsHonors : isMasters ? mastersHonors : null;
              return (
              <motion.div
                key={`${edu.institution}-${index}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                transition={{ delay: index * 0.1, duration: shouldReduceMotion ? 0 : 0.6 }}
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
                    {/* Subtle inner gold frame — diploma-style mat board */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-[1.25rem]"
                      style={{ border: `1px solid ${SNHU_BRAND.gold}26` }}
                    />

                    {/* Diagonal glint — faint light catch across the navy field */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
                      style={{
                        background: `linear-gradient(115deg, transparent 38%, ${SNHU_BRAND.gold} 50%, transparent 62%)`,
                      }}
                    />

                    {/* "In Progress" status pill for Master's */}
                    {isMasters && (
                      <div
                        className="absolute top-5 right-5 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold"
                        style={{
                          color: SNHU_BRAND.gold,
                          background: `${SNHU_BRAND.gold}1A`,
                          border: `1px solid ${SNHU_BRAND.gold}66`,
                          transform: "translateZ(18px)",
                        }}
                        aria-label="Diploma in progress"
                      >
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span>In Progress</span>
                      </div>
                    )}

                    <div className="relative flex h-full flex-col p-7 sm:p-8">
                      {/* SNHU brand seal — sits directly on the navy card.
                          The official SNHU.svg lockup is already navy-shield
                          + gold flame + white wordmark, so on a navy card it
                          reads as an emblem inlaid into the card itself
                          rather than a sticker pasted on top. No background
                          plate needed (and no inner shadow / chrome). */}
                      <div
                        className="mb-6 inline-flex h-14 sm:h-16 w-fit items-center justify-center"
                        style={{ transform: "translateZ(24px)" }}
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
                        {edu.degree || edu.institution}
                      </h3>

                      {/* Hairline gold accent — varsity badge motif */}
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
                                  aria-label={`${honor.name}, ${honor.date} — View on Merit Pages`}
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
                        <div className="mt-auto flex justify-center" style={{ transform: "translateZ(20px)" }}>
                          {isBachelors && (
                            <a
                              href={BACHELORS_DIPLOMA_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#00193A] transition-shadow"
                              style={{
                                background: SNHU_BRAND.gold,
                                color: SNHU_BRAND.ink,
                                boxShadow: `0 8px 20px -8px ${SNHU_BRAND.gold}80, inset 0 -2px 0 0 ${SNHU_BRAND.goldDeep}`,
                                "--tw-ring-color": `${SNHU_BRAND.gold}99`,
                              } as React.CSSProperties}
                              aria-label="View Bachelor's diploma on Parchment (opens in new tab)"
                            >
                              View diploma
                            </a>
                          )}
                          {isMasters && (
                            <button
                              type="button"
                              onClick={openMbaEasterEgg}
                              className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#00193A] transition-colors"
                              style={{
                                background: "rgba(254, 185, 19, 0.1)",
                                color: SNHU_BRAND.gold,
                                border: `1.5px solid ${SNHU_BRAND.gold}`,
                                "--tw-ring-color": `${SNHU_BRAND.gold}99`,
                              } as React.CSSProperties}
                              aria-label="MBA candidate — diploma in progress (click for a surprise)"
                            >
                              MBA candidate
                            </button>
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

        {/* High School — two brand-colored varsity badges, side by side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
          aria-labelledby="high-school-heading"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
            <h3
              id="high-school-heading"
              className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]"
            >
              High School
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {highSchools.map((school) => (
              <motion.div key={school.institution} variants={itemVariants}>
                <SchoolBadge school={school} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* MBA candidate Easter egg modal */}
      {mbaEasterEggOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mba-easter-egg-title"
          onClick={() => setMbaEasterEggOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMbaEasterEggOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              aria-label="Close quote dialog"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 id="mba-easter-egg-title" className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-1">
                  Diploma in progress
                </h3>
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-3">
                  While you wait, here&apos;s a little UX & project management wisdom:
                </p>
                <blockquote className="text-[var(--text-primary)] dark:text-[var(--text-primary)] font-medium italic border-l-4 border-[var(--primary)] pl-4 py-1">
                  &ldquo;{mbaEasterEggTip.quote}&rdquo;
                </blockquote>
                <p className="text-xs text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] mt-2">
                  — {mbaEasterEggTip.by} · {mbaEasterEggTip.tag}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMbaEasterEggOpen(false);
                    // Now that Certifications is its own tab on the parent
                    // ExperiencePage, jump there via the URL hash. The page's
                    // `hashchange` listener picks this up, switches to the
                    // Certifications tab, and scrolls to top. Guarded so we
                    // only push a new hash if it'd actually change.
                    if (typeof window !== "undefined" && window.location.hash !== "#certifications") {
                      window.location.hash = "certifications";
                    }
                  }}
                  className="mt-4 text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
                >
                  View my certifications →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
