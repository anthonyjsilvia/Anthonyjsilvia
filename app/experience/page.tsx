"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Sparkles } from "lucide-react";
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
 * Experience route — career content as tabs, driven by the NodeDa Resume
 * public embed API when available (with static LinkedIn-aligned fallback).
 */

type TabId = "experience" | "education" | "skills" | "certifications";

const TABS: { id: TabId; label: string; Icon: typeof Briefcase }[] = [
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "education", label: "Education", Icon: GraduationCap },
  { id: "skills", label: "Skills", Icon: Sparkles },
  { id: "certifications", label: "Certifications", Icon: Award },
];

const TAB_IDS = TABS.map((t) => t.id) as readonly TabId[];

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
  const { data } = usePublicResume();
  const profile = data?.profile ?? null;

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

  const handleTabSelect = useCallback(
    (id: TabId) => {
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
      <div className="flex justify-start px-[var(--hp-cine-pad,1.25rem)] pt-5">
        <div
          role="tablist"
          aria-label="Experience, Education, Skills, and Certifications"
          className="pointer-events-auto flex w-fit max-w-[calc(100vw-12rem)] sm:max-w-[calc(100vw-16rem)] items-center gap-2 overflow-x-auto"
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
                <span className="hidden min-[420px]:inline">{tab.label}</span>
                <span className="min-[420px]:hidden sr-only">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Portaled to body so `fixed` pins to the viewport — not to
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
