"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";

/**
 * Experience route — pairs the work history (Experience) with credentials
 * (Education) since both are CV/career content. The two sections are now
 * surfaced as **tabs** rather than stacked, so the page reads as a single
 * focused view that the visitor flips between, rather than one very long
 * scroll. The tab strip is sticky and floats just below the global nav
 * bar — a sub-nav that always tells you where you are.
 *
 * Page chrome (nav/footer/fab/accessibility modal) is still provided by
 * `SiteChrome` in `app/layout.tsx`; this file owns the tab UI and the
 * per-tab content swap only.
 */

type TabId = "experience" | "education" | "certifications";

const TABS: { id: TabId; label: string; Icon: typeof Briefcase }[] = [
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "education", label: "Education", Icon: GraduationCap },
  { id: "certifications", label: "Certifications", Icon: Award },
];

const TAB_IDS = TABS.map((t) => t.id) as readonly TabId[];

/**
 * Hash → tab id. Lets links like `/experience#certifications` deep-link
 * straight into a given tab. Only the known ids are honored; anything
 * else falls back to the supplied default.
 */
function tabFromHash(hash: string | undefined, fallback: TabId): TabId {
  const cleaned = (hash ?? "").replace(/^#/, "").toLowerCase();
  return (TAB_IDS as readonly string[]).includes(cleaned) ? (cleaned as TabId) : fallback;
}

export default function ExperiencePage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabId>("experience");

  // Honor an incoming hash on first mount so deep links land on the right
  // tab without flicker. We can't read `location` during SSR, so we set
  // initial state to the default and re-sync in an effect once mounted.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromHash = tabFromHash(window.location.hash, "experience");
    setActiveTab(fromHash);

    // Keep the active tab in sync with anything that changes the URL hash
    // mid-session — back/forward navigation, an in-page link like
    // `<a href="#certifications">`, or programmatic jumps (e.g. the MBA
    // easter egg modal's "View my certifications →" button). When the hash
    // actually flips us to a different tab, also smooth-scroll the viewport
    // back to the top so the visitor lands at the start of the new section
    // rather than stranded mid-page.
    const onHashChange = () => {
      const next = tabFromHash(window.location.hash, "experience");
      setActiveTab((prev) => {
        if (next === prev) return prev;
        window.scrollTo({
          top: 0,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        });
        return next;
      });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [shouldReduceMotion]);

  const handleTabSelect = useCallback(
    (id: TabId) => {
      if (id === activeTab) return;
      setActiveTab(id);

      // Reflect the active tab in the URL hash so refreshes / shares preserve
      // it, but without pushing a new history entry (that would make Back
      // act weird — Back should leave the page, not just toggle the tab).
      if (typeof window !== "undefined") {
        const url = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.replaceState(null, "", url);

        // Scroll the viewport back to the top of the new section so the
        // visitor isn't dropped mid-page after a tab switch. Honors the
        // reduced-motion preference.
        window.scrollTo({
          top: 0,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        });
      }
    },
    [activeTab, shouldReduceMotion],
  );

  // Roving-tabindex keyboard pattern: left/right arrows move focus between
  // tabs, Home/End jump to the first/last. This is what assistive tech
  // expects for ARIA `role="tablist"`.
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (currentIdx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIdx = (currentIdx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = TABS.length - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    const nextTab = TABS[nextIdx];
    handleTabSelect(nextTab.id);
    document.getElementById(`${nextTab.id}-tab`)?.focus();
  };

  return (
    <>
      {/* Sticky sub-nav tab strip — sits exactly under the global nav (which
          is h-16 on mobile, h-[68px] on sm+). Uses a frosted-glass background
          so the page content behind it reads through, matching the
          liquid-glass treatment on the main nav.
          z-30 keeps it under the nav (z-40) but above page content. */}
      <div
        className="sticky top-16 sm:top-[68px] z-30 border-b border-[var(--border-light)] bg-[var(--bg-secondary)]/75 backdrop-blur-xl backdrop-saturate-150"
      >
        <div
          role="tablist"
          aria-label="Experience, Education, and Certifications"
          className="mx-auto flex h-12 sm:h-14 w-full max-w-7xl items-center justify-center gap-1 px-4 sm:px-6 lg:px-8"
        >
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const { Icon } = tab;
            return (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabSelect(tab.id)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={`relative inline-flex h-9 items-center gap-2 rounded-full px-4 sm:px-5 text-sm font-medium leading-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                  isActive
                    ? "text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {/* Animated pill — framer-motion's `layoutId` is doing the
                    work: when the active tab changes, the pill animates from
                    its old position to the new one with a single spring,
                    no manual measuring required. Under reduced motion we
                    render a plain block (no morph) so nothing slides. */}
                {isActive &&
                  (shouldReduceMotion ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[var(--primary)]"
                    />
                  ) : (
                    <motion.span
                      layoutId="exp-edu-tab-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[var(--primary)]"
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                        mass: 0.7,
                      }}
                    />
                  ))}
                <Icon className="relative h-4 w-4" aria-hidden="true" />
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panels — only the active section is mounted at a time, so each
          section gets a fresh in-view animation on switch (their internal
          framer-motion `useInView` triggers replay on remount). Switching is
          a soft cross-fade with a small vertical glide, falling back to a
          flat swap under reduced motion. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeTab}-panel`}
          id={`${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === "experience" && <Experience />}
          {activeTab === "education" && <Education />}
          {activeTab === "certifications" && <Certifications />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
