"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FabNav from "@/components/FabNav";
import AccessibilityModal from "@/components/AccessibilityModal";
import TerminalMode from "@/components/TerminalMode";
import OsMode from "@/components/OsMode";
import {
  getAccessibilitySettings,
  applyAccessibilitySettings,
  type AccessibilitySettings,
} from "@/lib/accessibility-settings";

/**
 * SiteChrome is the persistent shell that wraps every page: navigation, footer,
 * back-to-top FAB, accessibility modal, and the skip-links.
 *
 * When `?embed=1` is present (AnthonyOS window iframes), chrome and overlays
 * are omitted so page content can fill an OS window without recursion.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [embed, setEmbed] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [osOpen, setOsOpen] = useState(false);
  const [osTerminalToken, setOsTerminalToken] = useState(0);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    reduceTransparency: false,
    reduceMotion: false,
    openDyslexic: false,
    colorScheme: "system",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmbed(params.get("embed") === "1");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || embed) return;
    const stored = getAccessibilitySettings();
    setAccessibilitySettings(stored);
    applyAccessibilitySettings(stored);
  }, [mounted, embed]);

  /**
   * Global easter-egg shortcuts:
   *   • ⌘K / Ctrl+K  → terminal (fullscreen, or Terminal.app window if OS open)
   *   • ⌘. / Ctrl+.  → AnthonyOS desktop
   */
  useEffect(() => {
    if (!mounted || embed) return;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isMod = e.metaKey || e.ctrlKey;
      const isOsToggle = e.code === "Period" || key === ".";
      if (!isMod || (key !== "k" && !isOsToggle)) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;

      if (key === "k") {
        if (editable && !terminalOpen && !osOpen) return;
        e.preventDefault();
        if (osOpen) {
          setOsTerminalToken((n) => n + 1);
          return;
        }
        setTerminalOpen((o) => !o);
        return;
      }

      if (editable && !osOpen) return;
      e.preventDefault();
      setTerminalOpen(false);
      setOsOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, embed, terminalOpen, osOpen]);

  if (!mounted) {
    return null;
  }

  if (embed) {
    return (
      <main
        id="main-content"
        role="main"
        aria-label="Embedded page"
        className="os-embed-root"
      >
        {children}
      </main>
    );
  }

  return (
    <>
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>
      <a href="#main-nav" className="skip-link" aria-label="Skip to menu">
        Skip to menu
      </a>
      <Navigation
        onOpenAccessibility={() => setAccessibilityOpen(true)}
      />
      <main
        key={pathname}
        id="main-content"
        role="main"
        aria-label="Main content"
        className="apple-reveal"
      >
        {children}
      </main>
      <Footer
        onOpenOs={() => {
          setTerminalOpen(false);
          setOsOpen(true);
        }}
      />
      <FabNav />
      <AccessibilityModal
        open={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onSettingsChange={setAccessibilitySettings}
      />
      <TerminalMode open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <OsMode
        open={osOpen}
        onClose={() => setOsOpen(false)}
        terminalLaunchToken={osTerminalToken}
        accessibilitySettings={accessibilitySettings}
        onAccessibilitySettingsChange={setAccessibilitySettings}
      />
    </>
  );
}
