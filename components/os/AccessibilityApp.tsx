"use client";

import { type ElementType } from "react";
import {
  Contrast,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import type { AccessibilitySettings, ColorScheme } from "@/lib/accessibility-settings";
import {
  setAccessibilitySettings,
  applyAccessibilitySettings,
} from "@/lib/accessibility-settings";

type Props = {
  embedded?: boolean;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
};

function OsToggle({
  id,
  label,
  description,
  checked,
  onChange,
  Icon,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  Icon: ElementType;
}) {
  return (
    <div className="os-a11y__card">
      <div className="os-a11y__card-top">
        <span className="os-a11y__icon" aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="os-a11y__label">
            {label}
          </label>
          <p className="os-a11y__desc">{description}</p>
        </div>
      </div>
      <div className="os-a11y__switch-row">
        <span className="os-a11y__state">{checked ? "On" : "Off"}</span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label}: ${checked ? "on" : "off"}`}
          onClick={() => onChange(!checked)}
          className={`os-a11y__switch${checked ? " is-on" : ""}`}
        >
          <span className="os-a11y__switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/** Accessibility settings as a native AnthonyOS app. */
export default function AccessibilityApp({
  embedded = false,
  settings,
  onSettingsChange,
}: Props) {
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

  const schemes: { value: ColorScheme; label: string; Icon: ElementType }[] = [
    { value: "system", label: "System", Icon: Monitor },
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <div className={`os-app os-app--single${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-app__single os-app__single--narrow os-a11y">
        <p className="os-app__eyebrow">Accessibility</p>
        <h1 className="os-app__single-title">Settings</h1>
        <p className="os-app__prose">
          Tune how this site looks and behaves. Choices are saved and persist
          across visits.
        </p>

        <section className="os-a11y__card" aria-label="Appearance">
          <div className="os-a11y__card-top">
            <span className="os-a11y__icon" aria-hidden="true">
              <Contrast className="h-4 w-4" />
            </span>
            <div>
              <p className="os-a11y__label">Appearance</p>
              <p className="os-a11y__desc">
                System follows your device setting.
              </p>
            </div>
          </div>
          <div className="os-a11y__segment" role="group" aria-label="Color scheme">
            {schemes.map((opt) => {
              const Icon = opt.Icon;
              const active = settings.colorScheme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  className={`os-a11y__segment-btn${active ? " is-active" : ""}`}
                  onClick={() => handleColorScheme(opt.value)}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <OsToggle
          id="os-a11y-transparency"
          label="No transparency"
          description="Solid surfaces instead of glass and blur effects."
          checked={settings.reduceTransparency}
          onChange={(v) => handleToggle("reduceTransparency", v)}
          Icon={Contrast}
        />
        <OsToggle
          id="os-a11y-motion"
          label="Reduce motion"
          description="Minimize animations and transitions."
          checked={settings.reduceMotion}
          onChange={(v) => handleToggle("reduceMotion", v)}
          Icon={Sparkles}
        />
        <OsToggle
          id="os-a11y-dyslexic"
          label="OpenDyslexic font"
          description="Use OpenDyslexic across the site for readability."
          checked={settings.openDyslexic}
          onChange={(v) => handleToggle("openDyslexic", v)}
          Icon={Type}
        />
      </div>
    </div>
  );
}
