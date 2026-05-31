"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Award, ChevronDown } from "lucide-react";

/**
 * Certifications — standalone section that used to live inside `Education`.
 *
 * Lives on its own now so the Experience page can surface it as a top-level
 * tab (Experience / Education / Certifications). Keeping it in its own file
 * also means the long list of credentials and their category filter don't
 * weigh down the Education component when it's mounted on its own.
 */

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

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [certTab, setCertTab] = useState<CertCategory | "all">("all");
  const [showAllCerts, setShowAllCerts] = useState(false);

  // On wider viewports the cert grid is 2-column, so 4 cards reads as a
  // balanced "two rows" preview rather than the awkward 3 (one row of two
  // + a lonely third) we'd see otherwise. Tracks the breakpoint live so a
  // window resize updates the preview count.
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
      id="certifications"
      ref={ref}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      aria-labelledby="certifications-heading"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="certifications-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Certifications
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        {/* Category filter + grid.
            Intentionally NOT wrapped in a Tilt3D card so the filter pills and
            Show-all button stay reliably clickable (no rotation / hit-test
            interference). */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full max-w-[1600px] mx-auto"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[var(--secondary)] drop-shadow-md" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                All credentials
              </h3>
            </div>

            {/* Category filter pills. This is a *nested* tablist (the outer
                Experience/Education/Certifications tablist lives on the page),
                so it carries its own distinct aria-label. */}
            <div
              className="flex flex-wrap gap-2 mb-8"
              role="tablist"
              aria-label="Filter certifications by category"
            >
              {(["all", "projectManagement", "uxDesign", "ai", "miscellaneous"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={certTab === tab}
                  aria-controls="cert-content"
                  id={`cert-tab-${tab}`}
                  aria-label={`Filter certifications by ${CERT_CATEGORY_LABELS[tab]}`}
                  onClick={() => {
                    setCertTab(tab);
                    setShowAllCerts(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
                    certTab === tab
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white dark:bg-black text-[var(--text-secondary)] dark:text-[var(--text-secondary)] border border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {CERT_CATEGORY_LABELS[tab]}
                </button>
              ))}
            </div>

            <div
              id="cert-content"
              role="tabpanel"
              aria-labelledby={`cert-tab-${certTab}`}
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                {visibleCerts.map((cert) => (
                  <li
                    key={cert.name}
                    className="card-3d flex flex-col gap-1 p-4 rounded-xl bg-white dark:bg-black border border-[var(--border-light)] hover:-translate-y-0.5"
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
                  aria-label={showAllCerts ? "Show fewer certifications" : "Show all certifications"}
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
    </section>
  );
}
