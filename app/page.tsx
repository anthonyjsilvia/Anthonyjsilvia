"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Portfolio from "@/components/Portfolio";
import Education from "@/components/Education";
import Recommendations from "@/components/Recommendations";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FabNav from "@/components/FabNav";
import AccessibilityModal from "@/components/AccessibilityModal";
import {
  getAccessibilitySettings,
  applyAccessibilitySettings,
  type AccessibilitySettings,
} from "@/lib/accessibility-settings";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
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

  if (!mounted) {
    return null;
  }

  return (
    <main id="main-content" className="min-h-screen" role="main" aria-label="Main content">
      <a href="#main-content" className="skip-link" aria-label="Skip to main content">
        Skip to main content
      </a>
      <a href="#main-nav" className="skip-link" aria-label="Skip to main navigation">
        Skip to navigation
      </a>
      <Navigation onOpenAccessibility={() => setAccessibilityOpen(true)} />
      <Hero />
      <About />
      <Experience />
      <Portfolio />
      <Education />
      <Recommendations />
      <Contact />
      <Footer />
      <FabNav onOpenAccessibility={() => setAccessibilityOpen(true)} />
      <AccessibilityModal
        open={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onSettingsChange={setAccessibilitySettings}
      />
    </main>
  );
}
