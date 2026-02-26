"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Accessibility } from "lucide-react";
import {
  getAccessibilitySettings,
  applyAccessibilitySettings,
  type AccessibilitySettings,
} from "@/lib/accessibility-settings";
import AccessibilityModal from "@/components/AccessibilityModal";

export default function AccessibilityButton() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceTransparency: false,
    reduceMotion: false,
    openDyslexic: false,
    colorScheme: "system",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const stored = getAccessibilitySettings();
    setSettings(stored);
    applyAccessibilitySettings(stored);
  }, []);

  const handleSettingsChange = (next: AccessibilitySettings) => {
    setSettings(next);
  };

  const springConfig = { type: "spring" as const, stiffness: 200, damping: 22 };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        aria-label="Open accessibility settings"
        aria-haspopup="dialog"
        whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        transition={springConfig}
      >
        <Accessibility className="h-6 w-6" aria-hidden />
      </motion.button>
      <AccessibilityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </>
  );
}
