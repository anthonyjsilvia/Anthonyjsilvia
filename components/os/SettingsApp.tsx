"use client";

import { useState, type ElementType } from "react";
import {
  AlignLeft,
  BookOpen,
  Contrast,
  Languages,
  Link2,
  Monitor,
  Moon,
  PanelBottom,
  PanelLeft,
  PanelRight,
  PanelTop,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import LanguageFlag from "@/components/LanguageFlag";
import {
  applyAccessibilitySettings,
  setAccessibilitySettings,
  type AccessibilitySettings,
  type ColorScheme,
  type TextScale,
} from "@/lib/accessibility-settings";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { defaultRegion, languages, localeMeta, type Locale } from "@/lib/i18n/languages";
import { DOCK_EDGES, type DockEdge } from "@/lib/os-dock";

type SectionId = "desktop" | "language" | "appearance" | "reading" | "comfort";

type BooleanSetting =
  | "reduceTransparency"
  | "reduceMotion"
  | "openDyslexic"
  | "readingSpace"
  | "emphasizeLinks"
  | "readingGuide";

type Props = {
  embedded?: boolean;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
  dockHidden: boolean;
  onDockHiddenChange: (hidden: boolean) => void;
  dockEdge: DockEdge;
  onDockEdgeChange: (edge: DockEdge) => void;
  dockFill: boolean;
  onDockFillChange: (fill: boolean) => void;
};

function OsToggle({
  id,
  label,
  description,
  checked,
  onChange,
  Icon,
  onLabel,
  offLabel,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  Icon: ElementType;
  onLabel: string;
  offLabel: string;
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
        <span className="os-a11y__state">{checked ? onLabel : offLabel}</span>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={`${label}: ${checked ? onLabel : offLabel}`}
          onClick={() => onChange(!checked)}
          className={`os-a11y__switch${checked ? " is-on" : ""}`}
        >
          <span className="os-a11y__switch-knob" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function SettingsApp({
  embedded = false,
  settings,
  onSettingsChange,
  dockHidden,
  onDockHiddenChange,
  dockEdge,
  onDockEdgeChange,
  dockFill,
  onDockFillChange,
}: Props) {
  const { locale, country, setLocale, messages } = useLocale();
  const { a11y, os } = messages;
  const activeLanguage = localeMeta(locale).languageId;

  const sections: { id: SectionId; label: string; Icon: ElementType }[] = [
    { id: "desktop", label: os.desktop, Icon: Monitor },
    { id: "language", label: os.language, Icon: Languages },
    { id: "appearance", label: a11y.appearance, Icon: Contrast },
    { id: "reading", label: os.reading, Icon: BookOpen },
    { id: "comfort", label: os.comfort, Icon: Sparkles },
  ];

  const [section, setSection] = useState<SectionId>("desktop");

  const commit = (next: AccessibilitySettings) => {
    onSettingsChange(next);
    setAccessibilitySettings(next);
    applyAccessibilitySettings(next);
  };

  const toggle = (key: BooleanSetting, value: boolean) => {
    commit({ ...settings, [key]: value });
  };

  const schemes: { value: ColorScheme; label: string; Icon: ElementType }[] = [
    { value: "system", label: a11y.system, Icon: Monitor },
    { value: "light", label: a11y.light, Icon: Sun },
    { value: "dark", label: a11y.dark, Icon: Moon },
  ];

  const scales: { value: TextScale; label: string }[] = [
    { value: "default", label: a11y.textDefault },
    { value: "large", label: a11y.textLarge },
    { value: "larger", label: a11y.textLarger },
  ];

  return (
    <div className={`os-settings-shell${embedded ? " os-app--embedded" : ""}`}>
      <div className="os-settings">
        <aside className="os-settings__nav" aria-label={os.settings}>
          <header className="os-settings__nav-head">
            <p className="os-app__eyebrow">{os.settings}</p>
            <h1 className="os-settings__title">{os.settings}</h1>
            <p className="os-settings__intro">{os.settingsIntro}</p>
          </header>
          <ul className="os-settings__list" role="listbox" aria-label={os.settings}>
            {sections.map((item) => {
              const Icon = item.Icon;
              const selected = item.id === section;
              return (
                <li key={item.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`os-settings__row${selected ? " is-selected" : ""}`}
                    onClick={() => setSection(item.id)}
                  >
                    <span className="os-settings__row-icon" aria-hidden="true">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="os-settings__row-label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="os-settings__pane" aria-label={sections.find((item) => item.id === section)?.label}>
          {section === "desktop" ? (
            <>
            <p className="os-a11y__desc">{os.desktopBody}</p>
            <section className="os-a11y__card" aria-label={os.dockEdge}>
              <div className="os-a11y__card-top">
                <span className="os-a11y__icon" aria-hidden="true">
                  <Monitor className="h-4 w-4" />
                </span>
                <div>
                  <p className="os-a11y__label">{os.dockEdge}</p>
                  <p className="os-a11y__desc">{os.dockEdgeBody}</p>
                </div>
              </div>
              <div className="os-a11y__segment" role="group" aria-label={os.dockEdge}>
                {DOCK_EDGES.map((edge) => {
                  const active = dockEdge === edge;
                  const label =
                    edge === "bottom"
                      ? os.dockBottom
                      : edge === "top"
                        ? os.dockTop
                        : edge === "left"
                          ? os.dockLeft
                          : os.dockRight;
                  const Icon =
                    edge === "bottom"
                      ? PanelBottom
                      : edge === "top"
                        ? PanelTop
                        : edge === "left"
                          ? PanelLeft
                          : PanelRight;
                  return (
                    <button
                      key={edge}
                      type="button"
                      aria-pressed={active}
                      className={`os-a11y__segment-btn${active ? " is-active" : ""}`}
                      onClick={() => onDockEdgeChange(edge)}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
            <OsToggle
              id="os-settings-dock-fill"
              label={os.fillDock}
              description={os.fillDockBody}
              checked={dockFill}
              onChange={onDockFillChange}
              Icon={Monitor}
              onLabel={a11y.on}
              offLabel={a11y.off}
            />
            <OsToggle
              id="os-settings-dock"
              label={os.hideDock}
              description={os.hideDockBody}
              checked={dockHidden}
              onChange={onDockHiddenChange}
              Icon={Monitor}
              onLabel={a11y.on}
              offLabel={a11y.off}
            />
            </>
          ) : null}

          {section === "language" ? (
            <div className="os-settings__language">
              <p className="os-a11y__desc">{os.languageBody}</p>
              <ul className="os-settings__langs">
                {languages.map((language) => {
                  const selected = language.id === activeLanguage;
                  const flagLocale: Locale = selected
                    ? locale
                    : defaultRegion(language.id, country);
                  return (
                    <li key={language.id} className={`os-settings__lang${selected ? " is-selected" : ""}`}>
                      <div className="os-settings__lang-head">
                        <span className="os-settings__flag">
                          <LanguageFlag locale={flagLocale} />
                        </span>
                        <span className="os-settings__lang-name">{language.nativeLabel}</span>
                      </div>
                      <div className="os-a11y__segment" role="group" aria-label={language.nativeLabel}>
                        {language.regions.map((region) => {
                          const active = locale === region.id;
                          return (
                            <button
                              key={region.id}
                              type="button"
                              aria-pressed={active}
                              className={`os-a11y__segment-btn${active ? " is-active" : ""}`}
                              onClick={() => setLocale(region.id)}
                            >
                              {region.nativeLabel}
                            </button>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {section === "appearance" ? (
            <>
              <section className="os-a11y__card" aria-label={a11y.appearance}>
                <div className="os-a11y__card-top">
                  <span className="os-a11y__icon" aria-hidden="true">
                    <Contrast className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="os-a11y__label">{a11y.appearance}</p>
                    <p className="os-a11y__desc">{a11y.appearanceBody}</p>
                  </div>
                </div>
                <div className="os-a11y__segment" role="group" aria-label={a11y.colorScheme}>
                  {schemes.map((opt) => {
                    const Icon = opt.Icon;
                    const active = settings.colorScheme === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={active}
                        aria-label={a11y.theme(opt.label)}
                        className={`os-a11y__segment-btn${active ? " is-active" : ""}`}
                        onClick={() => commit({ ...settings, colorScheme: opt.value })}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="os-a11y__card" aria-label={a11y.textSize}>
                <div className="os-a11y__card-top">
                  <span className="os-a11y__icon" aria-hidden="true">
                    <Type className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="os-a11y__label">{a11y.textSize}</p>
                    <p className="os-a11y__desc">{a11y.textSizeBody}</p>
                  </div>
                </div>
                <div className="os-a11y__segment" role="group" aria-label={a11y.textSize}>
                  {scales.map((opt) => {
                    const active = settings.textScale === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={active}
                        aria-label={a11y.textSizeName(opt.label)}
                        className={`os-a11y__segment-btn${active ? " is-active" : ""}`}
                        onClick={() => commit({ ...settings, textScale: opt.value })}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          ) : null}

          {section === "reading" ? (
            <>
              <p className="os-a11y__desc">{os.readingBody}</p>
              <OsToggle
                id="os-settings-reading-space"
                label={a11y.readingSpace}
                description={a11y.readingSpaceBody}
                checked={settings.readingSpace}
                onChange={(value) => toggle("readingSpace", value)}
                Icon={AlignLeft}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <OsToggle
                id="os-settings-links"
                label={a11y.emphasizeLinks}
                description={a11y.emphasizeLinksBody}
                checked={settings.emphasizeLinks}
                onChange={(value) => toggle("emphasizeLinks", value)}
                Icon={Link2}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <OsToggle
                id="os-settings-guide"
                label={a11y.readingGuide}
                description={a11y.readingGuideBody}
                checked={settings.readingGuide}
                onChange={(value) => toggle("readingGuide", value)}
                Icon={BookOpen}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
            </>
          ) : null}

          {section === "comfort" ? (
            <>
              <p className="os-a11y__desc">{os.comfortBody}</p>
              <OsToggle
                id="os-settings-transparency"
                label={a11y.noTransparency}
                description={a11y.noTransparencyBody}
                checked={settings.reduceTransparency}
                onChange={(value) => toggle("reduceTransparency", value)}
                Icon={Contrast}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <OsToggle
                id="os-settings-motion"
                label={a11y.reduceMotion}
                description={a11y.reduceMotionBody}
                checked={settings.reduceMotion}
                onChange={(value) => toggle("reduceMotion", value)}
                Icon={Sparkles}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
              <OsToggle
                id="os-settings-dyslexic"
                label={a11y.openDyslexic}
                description={a11y.openDyslexicBody}
                checked={settings.openDyslexic}
                onChange={(value) => toggle("openDyslexic", value)}
                Icon={Type}
                onLabel={a11y.on}
                offLabel={a11y.off}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
