"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Briefcase,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import ResumeSkills from "@/components/ResumeSkills";
import {
  ResumePublicProvider,
  usePublicResume,
} from "@/components/ResumePublicProvider";
import {
  mapCertificationsFromProfile,
  mapCollegeFromProfile,
  mapExperienceFromProfile,
  mapProjectsFromProfile,
  mapSkillsFromProfile,
} from "@/lib/resume-public";

/**
 * Experience route - career content as tabs, driven by the NodeDa Resume
 * public embed API when available (with static LinkedIn-aligned fallback).
 *
 * Chapter control stays a segmented tablist when it fits beside the Menu
 * cluster; otherwise it collapses to a popover (collision-aware, not a
 * hard breakpoint).
 */

type TabId = "experience" | "education" | "skills" | "certifications";

const TABS: { id: TabId; label: string; Icon: typeof Briefcase }[] = [
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "education", label: "Education", Icon: GraduationCap },
  { id: "skills", label: "Skills", Icon: Sparkles },
  { id: "certifications", label: "Certifications", Icon: Award },
];

const TAB_IDS = TABS.map((t) => t.id) as readonly TabId[];

/** Minimum clear space between chapter control and the Menu cluster. */
const CHAPTER_MIN_GAP_PX = 12;
/** Extra slack before expanding the popover back into tabs. */
const CHAPTER_RESTORE_SLACK_PX = 24;

function tabFromHash(hash: string | undefined, fallback: TabId): TabId {
  const cleaned = (hash ?? "").replace(/^#/, "").toLowerCase();
  return (TAB_IDS as readonly string[]).includes(cleaned) ? (cleaned as TabId) : fallback;
}

export default function ExperiencePage() {
  return (
    <ResumePublicProvider>
      <ExperiencePageInner />
    </ResumePublicProvider>
  );
}

function ExperiencePageInner() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabId>("experience");
  const [portalReady, setPortalReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const { data } = usePublicResume();
  const profile = data?.profile ?? null;

  const activeMeta = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const ActiveIcon = activeMeta.Icon;

  const experienceEntries = useMemo(
    () => (profile ? mapExperienceFromProfile(profile) : null),
    [profile],
  );
  const educationEntries = useMemo(
    () => (profile ? mapCollegeFromProfile(profile) : null),
    [profile],
  );
  const certificationItems = useMemo(
    () => (profile ? mapCertificationsFromProfile(profile) : null),
    [profile],
  );
  const skillItems = useMemo(
    () => (profile ? mapSkillsFromProfile(profile) : null),
    [profile],
  );
  const projectItems = useMemo(
    () => (profile ? mapProjectsFromProfile(profile) : null),
    [profile],
  );
  const summary = profile?.basics.summary?.trim() || null;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromHash = tabFromHash(window.location.hash, "experience");
    setActiveTab(fromHash);

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

  useEffect(() => {
    if (!compact) setMenuOpen(false);
  }, [compact]);

  const measureChapterOverflow = useCallback(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;

    const cluster = document.querySelector(
      "[data-site-menu-cluster]",
    ) as HTMLElement | null;
    const sizerRect = sizer.getBoundingClientRect();
    const tabsWidth = sizerRect.width;

    // If the Menu cluster isn't mounted yet, keep the full tablist.
    if (!cluster) {
      setCompact(false);
      return;
    }

    const available =
      cluster.getBoundingClientRect().left - sizerRect.left - CHAPTER_MIN_GAP_PX;
    const needsCompact = tabsWidth > available;

    setCompact((prev) => {
      if (needsCompact) return true;
      if (!prev) return false;
      return tabsWidth + CHAPTER_RESTORE_SLACK_PX > available;
    });
  }, []);

  useLayoutEffect(() => {
    if (!portalReady) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureChapterOverflow);
    };

    schedule();
    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver(schedule);
    if (sizerRef.current) observer.observe(sizerRef.current);
    const cluster = document.querySelector("[data-site-menu-cluster]");
    if (cluster) observer.observe(cluster);

    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      mutation.disconnect();
    };
  }, [measureChapterOverflow, portalReady]);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && popoverRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleTabSelect = useCallback(
    (id: TabId) => {
      setMenuOpen(false);
      if (id === activeTab) return;
      setActiveTab(id);

      if (typeof window !== "undefined") {
        const url = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.replaceState(null, "", url);
        window.scrollTo({
          top: 0,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        });
      }
    },
    [activeTab, shouldReduceMotion],
  );

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

  const chapterTabs = (
    <div
      className="pointer-events-none fixed top-0 inset-x-0 z-40"
      data-experience-chapters
    >
      <div
        ref={shellRef}
        className="relative flex justify-start px-[var(--hp-cine-pad,1.25rem)] pt-5"
      >
        {/* Invisible sizer: natural width of the full segmented control. */}
        <div
          ref={sizerRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex w-max items-center gap-2"
        >
          {TABS.map((tab) => {
            const { Icon } = tab;
            return (
              <span key={tab.id} className="exp-chapter-tab exp-chapter-tab--idle">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </span>
            );
          })}
        </div>

        <div
          data-experience-chapters-control
          className="pointer-events-auto relative"
        >
          {compact ? (
            <div ref={popoverRef} className="relative">
              <button
                ref={triggerRef}
                type="button"
                id={`${activeTab}-tab`}
                aria-haspopup="listbox"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={`Chapter: ${activeMeta.label}. Open to switch.`}
                onClick={() => setMenuOpen((o) => !o)}
                className="exp-chapter-tab exp-chapter-tab--active"
              >
                <ActiveIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{activeMeta.label}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.ul
                    id={menuId}
                    role="listbox"
                    aria-label="Experience chapters"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: -6, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -4, scale: 0.98 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="exp-chapter-popover absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[14.5rem] overflow-hidden rounded-2xl p-1.5"
                  >
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const { Icon } = tab;
                      return (
                        <li key={tab.id} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            onClick={() => handleTabSelect(tab.id)}
                            className={[
                              "exp-chapter-popover__option flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left",
                              isActive
                                ? "exp-chapter-popover__option--active"
                                : "exp-chapter-popover__option--idle",
                            ].join(" ")}
                          >
                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em]">
                              {tab.label}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div
              role="tablist"
              aria-label="Experience, Education, Skills, and Certifications"
              className="flex w-fit items-center gap-2"
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
                    className={[
                      "exp-chapter-tab",
                      isActive ? "exp-chapter-tab--active" : "exp-chapter-tab--idle",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Portaled to body so `fixed` pins to the viewport - not to
          `<main class="apple-reveal">`, whose entrance animation can create
          a containing block for fixed descendants. */}
      {portalReady ? createPortal(chapterTabs, document.body) : null}

      {/* Clear the fixed top controls */}
      <div className="h-[4.75rem]" aria-hidden="true" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeTab}-panel`}
          id={`${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={`${activeTab}-tab`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {activeTab === "experience" && (
            <Experience
              entries={experienceEntries}
              projects={projectItems}
              summary={summary}
            />
          )}
          {activeTab === "education" && (
            <Education collegeEntries={educationEntries} />
          )}
          {activeTab === "skills" && <ResumeSkills skills={skillItems} />}
          {activeTab === "certifications" && (
            <Certifications items={certificationItems} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
