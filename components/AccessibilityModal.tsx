"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { AccessibilitySettings, ColorScheme } from "@/lib/accessibility-settings";
import {
  setAccessibilitySettings,
  applyAccessibilitySettings,
} from "@/lib/accessibility-settings";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
};

const springConfig = { type: "spring" as const, stiffness: 200, damping: 22 };

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
  alwaysOpenDyslexic,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  alwaysOpenDyslexic?: boolean;
}) {
  const textContent = (
    <>
      <label
        htmlFor={id}
        className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] cursor-pointer leading-snug"
      >
        {label}
      </label>
      <p className="text-base text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-2 leading-relaxed">
        {description}
      </p>
    </>
  );
  return (
    <div className="flex items-start justify-between gap-6 py-6 first:pt-0 border-b border-[var(--border-light)] last:border-b-0">
      <div className={`flex-1 min-w-0 pr-4 ${alwaysOpenDyslexic ? "font-open-dyslexic" : ""}`}>
        {textContent}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? "on" : "off"}`}
        onClick={() => onChange(!checked)}
        className="relative flex h-7 w-12 flex-shrink-0 items-center rounded-full bg-[var(--bg-tertiary)] dark:bg-[var(--bg-tertiary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <span
          className={`absolute inset-0 rounded-full transition-colors ${
            checked ? "bg-[var(--primary)]" : "bg-transparent"
          }`}
          aria-hidden
        />
        <span
          className={`absolute left-1 top-1 z-10 h-5 w-5 rounded-full bg-white dark:bg-[var(--bg-secondary)] shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
          aria-hidden
        />
      </button>
    </div>
  );
}

export default function AccessibilityModal({
  open,
  onClose,
  settings,
  onSettingsChange,
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined") setOrigin(window.location.origin);
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const handleToggle = (key: keyof AccessibilitySettings, value: boolean) => {
    const next = { ...settings, [key]: value };
    onSettingsChange(next);
    setAccessibilitySettings(next);
    applyAccessibilitySettings(next);
  };

  const handleColorScheme = (value: ColorScheme) => {
    const next = { ...settings, colorScheme: value };
    onSettingsChange(next);
    setAccessibilitySettings(next);
    applyAccessibilitySettings(next);
  };

  const colorSchemeOptions: { value: ColorScheme; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[var(--background)] dark:bg-[var(--background)]"
          aria-modal="true"
          aria-labelledby="accessibility-settings-title"
          role="dialog"
        >
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed top-6 right-6 z-[61] flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white font-medium text-sm hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            aria-label="Close accessibility settings"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springConfig}
          >
            <X className="h-4 w-4" aria-hidden />
            Close
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="flex flex-1 flex-col min-h-0 w-full px-8 py-10 sm:px-12 sm:py-12 lg:px-20 lg:py-16"
          >
            <nav aria-label="Breadcrumb" className="mb-4">
              <Link
                href="/"
                className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:text-[var(--primary)] dark:hover:text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded"
                onClick={onClose}
              >
                {origin || "…"}
              </Link>
              <span aria-hidden="true" className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mx-1.5">
                /
              </span>
              <span className="text-sm text-[var(--text-primary)] dark:text-[var(--text-primary)] font-medium">
                Accessibility settings
              </span>
            </nav>
            <div className="mb-4">
              <h2
                id="accessibility-settings-title"
                className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] leading-tight pr-32"
              >
                Accessibility settings
              </h2>
            </div>
            <p className="text-base text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-12 leading-relaxed max-w-2xl">
              Your choices are saved in a cookie and will persist across visits.
            </p>
            <div className="flex-1 min-h-0">
              {/* Color scheme */}
              <div className="flex items-start justify-between gap-6 py-6 border-b border-[var(--border-light)]">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-lg font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] leading-snug">
                    Appearance
                  </p>
                  <p className="text-base text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mt-2 leading-relaxed">
                    Choose how the page is displayed. System follows your device setting.
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Color scheme"
                  className="flex-shrink-0 inline-flex rounded-xl border border-[var(--border-light)] p-1 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
                >
                  {colorSchemeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleColorScheme(opt.value)}
                      aria-pressed={settings.colorScheme === opt.value}
                      aria-label={`${opt.label} theme`}
                      className={`min-w-[5rem] px-4 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
                        settings.colorScheme === opt.value
                          ? "bg-[var(--primary)] text-white"
                          : "text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle
                id="accessibility-reduce-transparency"
                label="No transparency (100% opacity)"
                description="Remove all transparency: every element uses 100% opacity and semi-transparent backgrounds (e.g. 90% opacity, glass effects) become fully solid."
                checked={settings.reduceTransparency}
                onChange={(v) => handleToggle("reduceTransparency", v)}
              />
              <Toggle
                id="accessibility-reduce-motion"
                label="Reduce motion"
                description="Minimize animations and transitions across the site."
                checked={settings.reduceMotion}
                onChange={(v) => handleToggle("reduceMotion", v)}
              />
              <Toggle
                id="accessibility-open-dyslexic"
                label="OpenDyslexic font"
                description="Replace all site fonts with OpenDyslexic, a typeface designed to improve readability for people with dyslexia."
                checked={settings.openDyslexic}
                onChange={(v) => handleToggle("openDyslexic", v)}
                alwaysOpenDyslexic
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
