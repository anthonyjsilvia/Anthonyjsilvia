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
import SettingsApp from "@/components/os/SettingsApp";
import CoilApp from "@/components/os/CoilApp";
import type { AccessibilitySettings } from "@/lib/accessibility-settings";
import type { DockEdge } from "@/lib/os-dock";

type RenderOpts = {
  onOpenApp?: (id: string) => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilitySettingsChange?: (settings: AccessibilitySettings) => void;
  dockHidden?: boolean;
  onDockHiddenChange?: (hidden: boolean) => void;
  dockEdge?: DockEdge;
  onDockEdgeChange?: (edge: DockEdge) => void;
  dockFill?: boolean;
  onDockFillChange?: (fill: boolean) => void;
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
    case "coil":
      return <CoilApp />;
    case "settings":
      if (
        !opts.accessibilitySettings ||
        !opts.onAccessibilitySettingsChange ||
        opts.onDockHiddenChange == null ||
        opts.onDockEdgeChange == null ||
        opts.onDockFillChange == null
      ) {
        return null;
      }
      return (
        <SettingsApp
          embedded
          settings={opts.accessibilitySettings}
          onSettingsChange={opts.onAccessibilitySettingsChange}
          dockHidden={opts.dockHidden ?? false}
          onDockHiddenChange={opts.onDockHiddenChange}
          dockEdge={opts.dockEdge ?? "bottom"}
          onDockEdgeChange={opts.onDockEdgeChange}
          dockFill={opts.dockFill ?? true}
          onDockFillChange={opts.onDockFillChange}
        />
      );
    default:
      return null;
  }
}
