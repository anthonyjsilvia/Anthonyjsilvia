"use client";

import { type ElementType, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Contrast,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  Type,
  X,
} from "lucide-react";
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

/**
 * A single toggleable setting rendered as a self-contained card. Cards in the
 * same grid row stretch to equal height automatically; the toggle is pushed to
 * the bottom of the card with `mt-auto` so the control row always lines up
 * across cards even when descriptions are different lengths.
 */
function ToggleCard({
  id,
  label,
  description,
  checked,
  onChange,
  Icon,
  alwaysOpenDyslexic,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  Icon: ElementType;
  alwaysOpenDyslexic?: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] p-6 lg:p-7">
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[var(--primary)]"
          style={{ backgroundColor: "rgba(var(--primary-rgb), 0.12)" }}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className={`min-w-0 flex-1 ${alwaysOpenDyslexic ? "font-open-dyslexic" : ""}`}>
          <label
            htmlFor={id}
            className="block cursor-pointer text-lg font-semibold leading-snug text-[var(--text-primary)]"
          >
            {label}
          </label>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {checked ? "On" : "Off"}
        </span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label}: ${checked ? "on" : "off"}`}
          onClick={() => onChange(!checked)}
          className="relative flex h-7 w-12 flex-shrink-0 items-center rounded-full bg-[var(--bg-tertiary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
        >
          <span
            className={`absolute inset-0 rounded-full transition-colors ${
              checked ? "bg-[var(--primary)]" : "bg-transparent"
            }`}
            aria-hidden
          />
          <span
            className={`absolute left-1 top-1 z-10 h-5 w-5 rounded-full bg-white transition-transform dark:bg-[var(--bg-secondary)] ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
            aria-hidden
          />
        </button>
      </div>
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

  // Each scheme option ships its own icon — System gets the laptop, Light the
  // sun, Dark the moon — so the segmented control reads at a glance even on a
  // narrow column.
  const colorSchemeOptions: {
    value: ColorScheme;
    label: string;
    Icon: ElementType;
  }[] = [
    { value: "system", label: "System", Icon: Monitor },
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[var(--background)]"
          aria-modal="true"
          aria-labelledby="accessibility-settings-title"
          role="dialog"
        >
          {/* Close button — fixed in the corner so it stays reachable while the
              content scrolls underneath on smaller viewports. */}
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed right-6 top-6 z-[61] flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
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
            className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pb-16 pt-12 sm:px-10 sm:pt-14 lg:px-16 lg:pt-20"
          >
            {/* Header band ----------------------------------------------- */}
            <header className="pr-28 sm:pr-32">
              <nav aria-label="Breadcrumb" className="mb-4">
                <Link
                  href="/"
                  className="rounded text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  onClick={onClose}
                >
                  {origin ? origin.replace(/^https?:\/\//i, "") : "…"}
                </Link>
                <span aria-hidden="true" className="mx-1.5 text-sm text-[var(--text-secondary)]">
                  /
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Accessibility settings
                </span>
              </nav>
              <h2
                id="accessibility-settings-title"
                className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
              >
                Accessibility settings
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                Tune how this site looks and behaves. Your choices are saved in a cookie and
                will persist across visits.
              </p>
            </header>

            {/* Settings grid --------------------------------------------- */}
            {/*
              The grid is `grid-cols-1 md:grid-cols-3`. The Appearance card
              spans the full row (`md:col-span-3`) because its segmented
              control needs the horizontal real estate; the three on/off
              toggles below sit side-by-side on tablet+ so a wide viewport
              actually has something to do with its width.
            */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 lg:mt-12">
              {/* Appearance — full-width hero card */}
              <section className="md:col-span-3 flex flex-col gap-6 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-8">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[var(--primary)]"
                    style={{ backgroundColor: "rgba(var(--primary-rgb), 0.12)" }}
                  >
                    <Contrast className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold leading-snug text-[var(--text-primary)]">
                      Appearance
                    </p>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
                      Choose how the page is displayed. System follows your device setting and
                      switches with your OS.
                    </p>
                  </div>
                </div>
                <div
                  role="group"
                  aria-label="Color scheme"
                  className="inline-flex flex-shrink-0 rounded-xl border border-[var(--border-light)] bg-[var(--background)] p-1"
                >
                  {colorSchemeOptions.map((opt) => {
                    const isActive = settings.colorScheme === opt.value;
                    const Icon = opt.Icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleColorScheme(opt.value)}
                        aria-pressed={isActive}
                        aria-label={`${opt.label} theme`}
                        className={`inline-flex min-w-[6rem] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)] ${
                          isActive
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Three on/off toggle cards — auto-equalize height in the row */}
              <ToggleCard
                id="accessibility-reduce-transparency"
                label="No transparency"
                description="Remove all transparency: every element uses 100% opacity and semi-transparent backgrounds (e.g. glass effects) become fully solid."
                checked={settings.reduceTransparency}
                onChange={(v) => handleToggle("reduceTransparency", v)}
                Icon={Contrast}
              />
              <ToggleCard
                id="accessibility-reduce-motion"
                label="Reduce motion"
                description="Minimize animations and transitions across the site. Useful for vestibular sensitivity or saving battery."
                checked={settings.reduceMotion}
                onChange={(v) => handleToggle("reduceMotion", v)}
                Icon={Sparkles}
              />
              <ToggleCard
                id="accessibility-open-dyslexic"
                label="OpenDyslexic font"
                description="Replace all site fonts with OpenDyslexic, a typeface designed to improve readability for people with dyslexia."
                checked={settings.openDyslexic}
                onChange={(v) => handleToggle("openDyslexic", v)}
                Icon={Type}
                alwaysOpenDyslexic
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
