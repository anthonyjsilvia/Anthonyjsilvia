"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FabNav from "@/components/FabNav";
import AccessibilityModal from "@/components/AccessibilityModal";
import TerminalMode from "@/components/TerminalMode";
import {
  getAccessibilitySettings,
  applyAccessibilitySettings,
  type AccessibilitySettings,
} from "@/lib/accessibility-settings";

/**
 * SiteChrome is the persistent shell that wraps every page: navigation, footer,
 * back-to-top FAB, accessibility modal, and the skip-links. Moving this out
 * of individual pages means each `app/<route>/page.tsx` only owns its own
 * content - keeping the codebase simple now that the site is multi-page rather
 * than a single long-scroll layout.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    reduceTransparency: false,
    reduceMotion: false,
    openDyslexic: false,
    colorScheme: "system",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = getAccessibilitySettings();
    setAccessibilitySettings(stored);
    applyAccessibilitySettings(stored);
  }, [mounted]);

  /**
   * Global terminal-mode toggle - ⌘K on macOS, Ctrl+K elsewhere. Flips the
   * site between the normal page view and the keyboard-only terminal
   * easter egg. We intentionally bind at the chrome level (not inside
   * TerminalMode) so the shortcut works from any page, even when the
   * terminal isn't yet mounted.
   *
   * The listener is also smart enough to skip the toggle when the user is
   * typing into another text input - so ⌘K inside a textbox does the
   * platform-native thing (e.g. focusing browser search) rather than
   * hijacking the keystroke.
   */
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isModK) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;
      // If the user is typing in a real input AND the terminal is closed,
      // let the browser handle ⌘K normally (e.g. focus search, etc).
      // Once the terminal is open we always want ⌘K to close it again, even
      // if the focused element is the terminal's own input.
      if (editable && !terminalOpen) return;
      e.preventDefault();
      setTerminalOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, terminalOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>
      <a href="#main-nav" className="skip-link" aria-label="Skip to menu">
        Skip to menu
      </a>
      <Navigation onOpenAccessibility={() => setAccessibilityOpen(true)} />
      {/* Keying <main> on `pathname` retriggers the .apple-reveal CSS
          animation on every route change, giving each page an iOS-style
          fade + glide-up entrance for free. The keyframes themselves
          honor reduced-motion (see `.apple-reveal` in globals.css). */}
      <main
        key={pathname}
        id="main-content"
        role="main"
        aria-label="Main content"
        className="apple-reveal"
      >
        {children}
      </main>
      <Footer />
      <FabNav />
      <AccessibilityModal
        open={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onSettingsChange={setAccessibilitySettings}
      />
      {/* ⌘K easter egg - keyboard-only terminal that takes over the entire
          viewport. Mounted globally so the toggle works from any page. */}
      <TerminalMode open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
}
