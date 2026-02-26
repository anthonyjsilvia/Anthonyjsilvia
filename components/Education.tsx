"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GraduationCap, Calendar, Award, Trophy, ChevronDown, X, Lightbulb } from "lucide-react";

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

const highSchoolSchools = [
  { institution: "Wasilla High School", degree: "High School Diploma", period: "2015 - 2017" },
  { institution: "South Anchorage High School", degree: "", period: "June 2013 - June 2015" },
];

// Certifications from academic transcript — categorized for tabs and featured sections
type CertCategory = "projectManagement" | "uxDesign" | "ai" | "miscellaneous";

interface Certification {
  name: string;
  issuer: string;
  date: string;
  category: CertCategory;
  description?: string;
  url: string;
}

// Credly profile from transcript; individual badge URLs can be added from Credly if available
const CREDLY_PROFILE_URL = "https://www.credly.com/users/anthony-silvia";

const CERTIFICATIONS: Certification[] = [
  { name: "Project Management (PM1001)", issuer: "Sophia Learning", date: "Apr 2023", category: "projectManagement", description: "Life cycle of managing a project, from designing scope to completion. Applied experience with project planning, resources, and risks.", url: CREDLY_PROFILE_URL },
  { name: "The Essentials of Managing Conflict (CONRES1000)", issuer: "Sophia Learning", date: "Mar 2023", category: "projectManagement", description: "Foundational knowledge about managing and resolving conflict. Types and causes of conflict, conflict styles, and resolution techniques.", url: CREDLY_PROFILE_URL },
  { name: "Conflict Resolution (ConRes1001)", issuer: "Sophia Learning", date: "Apr 2023", category: "projectManagement", description: "Basic concepts of conflict resolution applied in real-world situations. Key theories and skills in organizational, intercultural, family, and interpersonal contexts.", url: CREDLY_PROFILE_URL },
  { name: "Workplace Communication (COMM1010)", issuer: "Sophia Learning", date: "Mar 2023", category: "projectManagement", description: "Successful workplace communication: oral and written communication, professional writing, collaboration and productivity tools.", url: CREDLY_PROFILE_URL },
  { name: "Accounting (ACCT1001)", issuer: "Sophia Learning", date: "Mar 2021", category: "projectManagement", description: "Fundamental principles and procedures of modern accounting. Bookkeeping and financial reports.", url: CREDLY_PROFILE_URL },
  { name: "Microsoft Excel for Accounting", issuer: "Wiley Finance & Accounting", date: "Sep 2025", category: "projectManagement", description: "Excel functions and tools to create and analyze data effectively. Accounting-based skills.", url: CREDLY_PROFILE_URL },
  { name: "Google UX Design Professional Certificate", issuer: "Coursera", date: "Apr 2022", category: "uxDesign", description: "End-to-end design process: empathizing with users, defining pain points, ideating solutions, wireframes and prototypes, testing designs.", url: CREDLY_PROFILE_URL },
  { name: "UX Foundations: Accessibility", issuer: "Southern New Hampshire University", date: "—", category: "uxDesign", url: CREDLY_PROFILE_URL },
  { name: "Visual Communications (VisComm1001)", issuer: "Sophia Learning", date: "Mar 2023", category: "uxDesign", description: "Basic concepts of visual design, visual theories, key elements and principles of design—color, typography, and layout.", url: CREDLY_PROFILE_URL },
  { name: "Introduction to Web Development (CS1005)", issuer: "Sophia Learning", date: "Mar 2023", category: "uxDesign", description: "Basic computer concepts for web developers. How the internet works, roles of software engineering and web development.", url: CREDLY_PROFILE_URL },
  { name: "Google AI Essentials", issuer: "Coursera", date: "Apr 2024", category: "ai", description: "Integrating AI into work. Generative AI tools, writing effective prompts, using AI responsibly.", url: CREDLY_PROFILE_URL },
  { name: "Introduction to Statistics (STAT1001)", issuer: "Sophia Learning", date: "Dec 2022", category: "projectManagement", description: "Basic principles of statistics: statistical principles, research methodologies, data analysis, and hypothesis testing.", url: CREDLY_PROFILE_URL },
  { name: "Personal Finance (ECON1010)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Key concepts of economics and personal finance. Economic mindset, tools for financial analysis.", url: CREDLY_PROFILE_URL },
  { name: "Spanish I (SPAN1001)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Fundamentals to read, write, and speak Spanish. Linguistic and cultural lens.", url: CREDLY_PROFILE_URL },
  { name: "IT Career Exploration (CS1003)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Skills needed in the IT industry. Roles including UX Designer, QA, Web Developer, Software Engineer.", url: CREDLY_PROFILE_URL },
  { name: "Introduction to Psychology (PSYC1010)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Learning, motivation, development, emotion, and personality. Using knowledge to make smarter decisions.", url: CREDLY_PROFILE_URL },
  { name: "Introduction to Information Technology (CS1001)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Overview of information systems: hardware and software, networking, database management, privacy, security, ethics.", url: CREDLY_PROFILE_URL },
  { name: "Workplace Writing II (ENG1020)", issuer: "Sophia Learning", date: "Apr 2023", category: "miscellaneous", description: "Research process, sourcing information, persuasive essay writing. Professional communication and problem solving.", url: CREDLY_PROFILE_URL },
  { name: "US History I (HIST1001)", issuer: "Sophia Learning", date: "May 2023", category: "miscellaneous", description: "Key events and figures in US history from prehistory through Reconstruction.", url: CREDLY_PROFILE_URL },
  { name: "Introduction to Nutrition (HLTH1010)", issuer: "Sophia Learning", date: "May 2023", category: "miscellaneous", description: "Concepts and practical applications of nutrition. Scientific principles, nutrients, disease management.", url: CREDLY_PROFILE_URL },
  { name: "Data Analytics Core Concepts Certificate", issuer: "Association of International Certified Professional Accountants", date: "Feb 2026", category: "projectManagement", description: "Analytical mindset and core concepts of data analytics. Frame problems, define scopes, outcome-driven projects.", url: CREDLY_PROFILE_URL },
];

const CERT_CATEGORY_LABELS: Record<CertCategory | "all", string> = {
  all: "All",
  projectManagement: "Project Management",
  uxDesign: "UX Design",
  ai: "AI",
  miscellaneous: "Miscellaneous",
};

const CERT_INITIAL_VISIBLE = 3;

// Honors earned during Bachelor's at SNHU (badge images) — Honor Roll count is pre-2025 only
const bachelorsHonors = [
  { name: "Dean's List", date: "May 2024", badge: "/awards/deans-list-SNHU.png" },
  { name: "President's List", date: "Sep 2023", badge: "/awards/Presidents-list-SNHU.png" },
  { name: "Honor Roll", date: "8 times", badge: "/awards/honor-role-SNHU.png" },
];

// Honors earned during Master's at SNHU (badge images)
const mastersHonors = [
  { name: "Honor Roll", date: "Nov 2025", badge: "/awards/honor-role-SNHU.png" },
];

const MERIT_PAGES_URL = "https://meritpages.com/Anthonyjsilvia";
const BACHELORS_DIPLOMA_URL = "https://www.parchment.com/u/award/917e24e9b7910565b7671dcdaa09e483";

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [certTab, setCertTab] = useState<CertCategory | "all">("all");
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [mbaEasterEggOpen, setMbaEasterEggOpen] = useState(false);
  const [mbaEasterEggTip, setMbaEasterEggTip] = useState(MBA_EASTER_EGG_TIPS[0]);

  const [certInitialVisible, setCertInitialVisible] = useState(CERT_INITIAL_VISIBLE);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setCertInitialVisible(mq.matches ? 4 : CERT_INITIAL_VISIBLE);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const filteredCerts =
    certTab === "all"
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.category === certTab);
  const visibleCerts = showAllCerts ? filteredCerts : filteredCerts.slice(0, certInitialVisible);
  const hasMoreCerts = filteredCerts.length > certInitialVisible;

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
                className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)] flex flex-col h-full"
              >
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      {edu.degree ? (
                        <>
                          <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2">
                            {edu.degree}
                          </h3>
                          <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-3">
                            {edu.institution}
                          </p>
                        </>
                      ) : (
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-3">
                          {edu.institution}
                        </h3>
                      )}
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>{edu.period}</span>
                      </div>
                      {honors && (
                        <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                          <h4 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                            <Trophy className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                            Honors earned during degree
                          </h4>
                          <ul className="flex flex-wrap gap-6" role="list">
                            {honors.map((honor) => (
                              <li key={`${honor.name}-${honor.date}`} className="flex flex-col items-center gap-2">
                                <a
                                  href={MERIT_PAGES_URL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] focus:ring-offset-2 rounded-lg transition-opacity hover:opacity-90"
                                  aria-label={`${honor.name}, ${honor.date} — View on Merit Pages`}
                                >
                                  <Image
                                    src={honor.badge}
                                    alt=""
                                    width={120}
                                    height={120}
                                    className="object-contain"
                                  />
                                </a>
                                <span className="text-xs text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] text-center">
                                  {honor.date}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {(isBachelors || isMasters) && (
                    <div className="mt-auto pt-6 flex justify-center">
                      {isBachelors && (
                        <a
                          href={BACHELORS_DIPLOMA_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium text-sm hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          aria-label="View Bachelor's diploma on Parchment (opens in new tab)"
                        >
                          View diploma
                        </a>
                      )}
                      {isMasters && (
                        <button
                          type="button"
                          onClick={openMbaEasterEgg}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] dark:bg-[var(--bg-tertiary)] text-[var(--text-primary)] dark:text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] transition-colors"
                          aria-label="MBA candidate — diploma in progress (click for a surprise)"
                        >
                          MBA candidate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
            })}
          </div>
        </div>

        {/* High School — full width below college, same style as Certifications */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6">
                  High School
                </h3>
                <ul className="space-y-4" role="list">
                  {highSchoolSchools.map((school) => (
                    <li key={school.institution}>
                      <p className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                        {school.institution}
                      </p>
                      {school.degree ? (
                        <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm mb-1">
                          {school.degree}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
                        <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        <span>{school.period}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Certifications — tabs + single list, 3 visible then Show all */}
        <motion.div
          id="certifications"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full max-w-[1600px] mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[var(--secondary)]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Certifications
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter certifications by category">
              {(["all", "projectManagement", "uxDesign", "ai", "miscellaneous"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={certTab === tab}
                  aria-controls="cert-content"
                  id={`cert-tab-${tab}`}
                  onClick={() => {
                    setCertTab(tab);
                    setShowAllCerts(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
                    certTab === tab
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {CERT_CATEGORY_LABELS[tab]}
                </button>
              ))}
            </div>

            <div id="cert-content" role="tabpanel" aria-labelledby={`cert-tab-${certTab}`}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                {visibleCerts.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex flex-col gap-1 p-4 rounded-xl bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] border border-[var(--border-light)]"
                  >
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] dark:text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] rounded"
                      aria-label={`View ${cert.name} credential (opens in new tab)`}
                    >
                      {cert.name}
                    </a>
                    <span className="text-sm text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
                      {cert.issuer} · {cert.date}
                    </span>
                    {cert.description && (
                      <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-1 line-clamp-3">
                        {cert.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {hasMoreCerts && (
                <button
                  type="button"
                  onClick={() => setShowAllCerts(!showAllCerts)}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] rounded"
                >
                  {showAllCerts ? "Show less" : "Show all"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showAllCerts ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </motion.div>
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
              aria-label="Close"
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
                    document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
