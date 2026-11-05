"use client";

import { type ElementType, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlignLeft,
  BookOpen,
  Contrast,
  Link2,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  Type,
  X,
} from "lucide-react";
import type { AccessibilitySettings, ColorScheme, TextScale } from "@/lib/accessibility-settings";
import { useMessages } from "@/lib/i18n/LocaleProvider";
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
  onLabel,
  offLabel,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  Icon: ElementType;
  alwaysOpenDyslexic?: boolean;
  onLabel: string;
  offLabel: string;
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
          {checked ? onLabel : offLabel}
        </span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label}: ${checked ? onLabel : offLabel}`}
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
  const a11y = useMessages().a11y;
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

  const handleToggle = (
    key: "reduceTransparency" | "reduceMotion" | "openDyslexic" | "readingSpace" | "emphasizeLinks" | "readingGuide",
    value: boolean,
  ) => {
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

  const handleTextScale = (value: TextScale) => {
    const next = { ...settings, textScale: value };
    onSettingsChange(next);
    setAccessibilitySettings(next);
    applyAccessibilitySettings(next);
  };

  const textScaleOptions: { value: TextScale; label: string }[] = [
    { value: "default", label: a11y.textDefault },
    { value: "large", label: a11y.textLarge },
    { value: "larger", label: a11y.textLarger },
  ];

  // Each scheme option ships its own icon - System gets the laptop, Light the
  // sun, Dark the moon - so the segmented control reads at a glance even on a
  // narrow column.
  const colorSchemeOptions: {
    value: ColorScheme;
    label: string;
    Icon: ElementType;
  }[] = [
    { value: "system", label: a11y.system, Icon: Monitor },
    { value: "light", label: a11y.light, Icon: Sun },
    { value: "dark", label: a11y.dark, Icon: Moon },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[230] flex flex-col overflow-y-auto bg-[var(--background)]"
          aria-modal="true"
          aria-labelledby="accessibility-settings-title"
          role="dialog"
        >
          {/* Close button - fixed in the corner so it stays reachable while the
              content scrolls underneath on smaller viewports. */}
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed right-6 top-6 z-[231] flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            aria-label={a11y.closeSettings}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springConfig}
          >
            <X className="h-4 w-4" aria-hidden />
            {a11y.close}
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
                <nav aria-label={a11y.breadcrumb} className="mb-4">
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
                  {a11y.title}
                </span>
              </nav>
              <h2
                id="accessibility-settings-title"
                className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
              >
                {a11y.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                {a11y.intro}
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
              {/* Appearance - full-width hero card */}
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
                      {a11y.appearance}
                    </p>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
                      {a11y.appearanceBody}
                    </p>
                  </div>
                </div>
                <div
                  role="group"
                  aria-label={a11y.colorScheme}
                  className="flex w-full max-w-full flex-wrap gap-1 rounded-xl border border-[var(--border-light)] bg-[var(--background)] p-1 sm:w-auto sm:flex-shrink-0 sm:flex-nowrap"
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
                        aria-label={a11y.theme(opt.label)}
                        className={`inline-flex min-w-[4.5rem] flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)] sm:flex-none sm:px-4 ${
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

              <section className="md:col-span-3 flex flex-col gap-6 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-8">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[var(--primary)]"
                    style={{ backgroundColor: "rgba(var(--primary-rgb), 0.12)" }}
                  >
                    <Type className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold leading-snug text-[var(--text-primary)]">
                      {a11y.textSize}
                    </p>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
                      {a11y.textSizeBody}
                    </p>
                  </div>
                </div>
                <div
                  role="group"
                  aria-label={a11y.textSize}
                  className="flex w-full max-w-full flex-wrap gap-1 rounded-xl border border-[var(--border-light)] bg-[var(--background)] p-1 sm:w-auto sm:flex-shrink-0 sm:flex-nowrap"
                >
                  {textScaleOptions.map((opt) => {
                    const isActive = settings.textScale === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleTextScale(opt.value)}
                        aria-pressed={isActive}
                        aria-label={a11y.textSizeName(opt.label)}
                        className={`inline-flex min-w-[4.5rem] flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)] sm:flex-none sm:px-4 ${
                          isActive
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              <ToggleCard
                id="accessibility-reading-space"
                label={a11y.readingSpace}
                description={a11y.readingSpaceBody}
                checked={settings.readingSpace}
                onChange={(v) => handleToggle("readingSpace", v)}
                Icon={AlignLeft}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <ToggleCard
                id="accessibility-emphasize-links"
                label={a11y.emphasizeLinks}
                description={a11y.emphasizeLinksBody}
                checked={settings.emphasizeLinks}
                onChange={(v) => handleToggle("emphasizeLinks", v)}
                Icon={Link2}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <ToggleCard
                id="accessibility-reading-guide"
                label={a11y.readingGuide}
                description={a11y.readingGuideBody}
                checked={settings.readingGuide}
                onChange={(v) => handleToggle("readingGuide", v)}
                Icon={BookOpen}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <ToggleCard
                id="accessibility-reduce-transparency"
                label={a11y.noTransparency}
                description={a11y.noTransparencyBody}
                checked={settings.reduceTransparency}
                onChange={(v) => handleToggle("reduceTransparency", v)}
                Icon={Contrast}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <ToggleCard
                id="accessibility-reduce-motion"
                label={a11y.reduceMotion}
                description={a11y.reduceMotionBody}
                checked={settings.reduceMotion}
                onChange={(v) => handleToggle("reduceMotion", v)}
                Icon={Sparkles}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <ToggleCard
                id="accessibility-open-dyslexic"
                label={a11y.openDyslexic}
                description={a11y.openDyslexicBody}
                checked={settings.openDyslexic}
                onChange={(v) => handleToggle("openDyslexic", v)}
                Icon={Type}
                alwaysOpenDyslexic
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
