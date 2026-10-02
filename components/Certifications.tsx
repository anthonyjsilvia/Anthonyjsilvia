"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Award, ChevronDown } from "lucide-react";
import GlowButton from "@/components/GlowButton";
import FluentReveal from "@/components/FluentReveal";

/**
 * Certifications - standalone section that used to live inside `Education`.
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
  { name: "Google UX Design Professional Certificate", issuer: "Coursera", date: "Apr 2022", category: "uxDesign", description: "End-to-end design process: empathizing with users, defining pain points, ideating solutions, wireframes and prototypes, testing designs.", url: CREDLY_PROFILE_URL },
  { name: "UX Foundations: Accessibility", issuer: "Southern New Hampshire University", date: " - ", category: "uxDesign", url: CREDLY_PROFILE_URL },
  { name: "Google AI Essentials", issuer: "Coursera", date: "Apr 2024", category: "ai", description: "Integrating AI into work. Generative AI tools, writing effective prompts, using AI responsibly.", url: CREDLY_PROFILE_URL },
  { name: "Data Analytics Core Concepts Certificate", issuer: "Association of International Certified Professional Accountants", date: "Feb 2026", category: "projectManagement", description: "Analytical mindset and core concepts of data analytics. Frame problems, define scopes, outcome-driven projects.", url: CREDLY_PROFILE_URL },
  { name: "Microsoft Excel for Accounting", issuer: "Wiley Finance & Accounting", date: "Sep 2025", category: "projectManagement", description: "Excel functions and tools to create and analyze data effectively.", url: CREDLY_PROFILE_URL },
];

const CERT_CATEGORY_LABELS: Record<CertCategory | "all", string> = {
  all: "All",
  projectManagement: "Project Management",
  uxDesign: "UX Design",
  ai: "AI",
  miscellaneous: "Miscellaneous",
};

const CERT_INITIAL_VISIBLE = 3;

export default function Certifications({
  items,
}: {
  /** Live credentials from NodeDa Resume embed API. Falls back to static Credly list. */
  items?: Array<{
    name: string;
    issuer: string;
    date: string;
    description?: string;
    url: string;
    category?: CertCategory;
  }> | null;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [certTab, setCertTab] = useState<CertCategory | "all">("all");
  const [showAllCerts, setShowAllCerts] = useState(false);
  const sourceCerts: Certification[] =
    items && items.length > 0
      ? items
          .filter((c) => !/sophia/i.test(c.issuer))
          .map((c) => ({
            name: c.name,
            issuer: c.issuer,
            date: c.date,
            category: c.category ?? "miscellaneous",
            description: c.description,
            url: c.url,
          }))
      : CERTIFICATIONS;
  const fromApi = Boolean(items && items.length > 0);

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
    fromApi || certTab === "all"
      ? sourceCerts
      : sourceCerts.filter((c) => c.category === certTab);
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
      className="hp-cine-stage bg-[var(--background)]"
      aria-labelledby="certifications-heading"
    >
      <div className="w-full max-w-[var(--hp-cine-max)] mx-auto">
        {/* Category filter + grid.
            Intentionally NOT wrapped in a Tilt3D card so the filter pills and
            Show-all button stay reliably clickable (no rotation / hit-test
            interference). */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full"
        >
          <motion.div variants={itemVariants} className="mb-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              Credentials
            </p>
            <h2
              id="certifications-heading"
              className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]"
            >
              Certifications
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
              <h3 className="text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                All credentials
              </h3>
            </div>

            {/* Category filter pills - hidden when credentials come from the
                Resume API (no category metadata in the public schema). */}
            {!fromApi && (
            <div
              className="flex flex-wrap gap-2 mb-8"
              role="tablist"
              aria-label="Filter certifications by category"
            >
              {(["all", "projectManagement", "uxDesign", "ai", "miscellaneous"] as const).map((tab) => (
                <GlowButton
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={certTab === tab}
                  aria-controls="cert-content"
                  id={`cert-tab-${tab}`}
                  aria-label={`Filter certifications by ${CERT_CATEGORY_LABELS[tab]}`}
                  variant={certTab === tab ? "primary" : "secondary"}
                  onClick={() => {
                    setCertTab(tab);
                    setShowAllCerts(false);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
                    certTab === tab
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white dark:bg-black text-[var(--text-secondary)] dark:text-[var(--text-secondary)] border border-[var(--border-light)]"
                  }`}
                >
                  {CERT_CATEGORY_LABELS[tab]}
                </GlowButton>
              ))}
            </div>
            )}

            <div
              id="cert-content"
              role="tabpanel"
              aria-labelledby={`cert-tab-${certTab}`}
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
                {visibleCerts.map((cert) => (
                  <li key={cert.name}>
                    <FluentReveal
                      intensity="card"
                      className="card-3d flex flex-col gap-1 p-4 rounded-xl bg-white dark:bg-black border border-[var(--border-light)] h-full"
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
                        {[cert.issuer, cert.date].filter(Boolean).join(" · ") || "Credential"}
                      </span>
                      {cert.description && (
                        <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-1 line-clamp-3">
                          {cert.description}
                        </p>
                      )}
                    </FluentReveal>
                  </li>
                ))}
              </ul>
              {hasMoreCerts && (
                <GlowButton
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAllCerts(!showAllCerts)}
                  aria-label={showAllCerts ? "Show fewer certifications" : "Show all certifications"}
                  className="mt-6 text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] rounded px-3 py-2"
                >
                  {showAllCerts ? "Show less" : "Show all"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showAllCerts ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </GlowButton>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
