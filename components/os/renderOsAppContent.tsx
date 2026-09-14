"use client";

import type { ReactNode } from "react";
import KindWordsApp from "@/components/KindWordsApp";
import HomeApp from "@/components/os/HomeApp";
import SelectedWorkApp from "@/components/os/SelectedWorkApp";
import AiPracticeApp from "@/components/os/AiPracticeApp";
import AboutApp from "@/components/os/AboutApp";
import ExperienceApp from "@/components/os/ExperienceApp";
import PortfolioApp from "@/components/os/PortfolioApp";
import EvidenceApp from "@/components/os/EvidenceApp";
import ResumeApp from "@/components/os/ResumeApp";
import ContactApp from "@/components/os/ContactApp";
import AccessibilityApp from "@/components/os/AccessibilityApp";
import type { AccessibilitySettings } from "@/lib/accessibility-settings";

type RenderOpts = {
  onOpenApp?: (id: string) => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilitySettingsChange?: (settings: AccessibilitySettings) => void;
};

/** Renders the AnthonyOS-native UI for a dock app id. */
export function renderOsAppContent(
  appId: string,
  opts: RenderOpts = {},
): ReactNode | null {
  switch (appId) {
    case "home":
      return <HomeApp embedded onOpenApp={opts.onOpenApp} />;
    case "work":
      return <SelectedWorkApp embedded />;
    case "ai":
      return <AiPracticeApp embedded />;
    case "about":
      return <AboutApp embedded />;
    case "recommendations":
      return <KindWordsApp embedded />;
    case "experience":
      return <ExperienceApp embedded />;
    case "portfolio":
      return <PortfolioApp embedded />;
    case "evidence":
      return <EvidenceApp embedded />;
    case "resume":
      return <ResumeApp embedded />;
    case "contact":
      return <ContactApp embedded />;
    case "accessibility":
      if (!opts.accessibilitySettings || !opts.onAccessibilitySettingsChange) {
        return null;
      }
      return (
        <AccessibilityApp
          embedded
          settings={opts.accessibilitySettings}
          onSettingsChange={opts.onAccessibilitySettingsChange}
        />
      );
    default:
      return null;
  }
}
