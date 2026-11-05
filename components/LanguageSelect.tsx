"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import LanguageFlag from "@/components/LanguageFlag";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  defaultRegion,
  languages,
  localeMeta,
  type LanguageId,
  type Locale,
} from "@/lib/i18n/languages";

type LanguageSelectProps = {
  /** Inline sits in the header tools cluster. Dock is the phone control. */
  placement: "inline" | "dock";
  tone?: string;
};

export default function LanguageSelect({
  placement,
  tone = "site-menu-icon-btn--surface",
}: LanguageSelectProps) {
  const { locale, country, setLocale, messages } = useLocale();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<LanguageId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = localeMeta(locale);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setExpanded(null);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setExpanded(null);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setLocale(next);
    setOpen(false);
    setExpanded(null);
  };

  return (
    <div
      ref={rootRef}
      className={
        placement === "dock"
          ? "language-select language-select--dock pointer-events-auto fixed bottom-6 left-[max(1.25rem,env(safe-area-inset-left))] z-50 flex sm:hidden"
          : "language-select relative hidden sm:flex"
      }
    >
      <button
        type="button"
        className={`language-select__trigger site-menu-icon-btn ${placement === "dock" ? "site-menu-icon-btn--surface" : tone}`}
        aria-label={`${messages.chrome.chooseLanguage}, ${current.languageLabel}, ${current.nativeLabel}`}
        title={messages.chrome.language}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            setExpanded(next ? current.languageId : null);
            return next;
          });
        }}
      >
        <LanguageFlag locale={current.id} />
      </button>
      {open ? (
        <ul
          id={listId}
          role="menu"
          aria-label={messages.chrome.language}
          className={`language-menu absolute z-50 ${
            placement === "dock"
              ? "bottom-[calc(100%+0.5rem)] left-0"
              : "right-0 top-[calc(100%+0.5rem)]"
          }`}
        >
          {languages.map((language) => {
            const isExpanded = expanded === language.id;
            const regionId = `${listId}-${language.id}`;
            const rowLocale = language.regions.some((region) => region.id === locale)
              ? locale
              : defaultRegion(language.id, country);
            return (
              <li key={language.id}>
                <button
                  type="button"
                  role="menuitem"
                  className="language-menu__option"
                  aria-expanded={isExpanded}
                  aria-controls={regionId}
                  onClick={() => setExpanded(isExpanded ? null : language.id)}
                >
                  <LanguageFlag locale={rowLocale} />
                  <span>{language.nativeLabel}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className={`language-menu__chevron${isExpanded ? " language-menu__chevron--open" : ""}`}
                  />
                </button>
                {isExpanded ? (
                  <ul id={regionId} role="menu" aria-label={language.nativeLabel} className="language-menu__regions">
                    {language.regions.map((region) => {
                      const selected = region.id === locale;
                      return (
                        <li key={region.id}>
                          <button
                            type="button"
                            role="menuitemradio"
                            aria-checked={selected}
                            className="language-menu__option language-menu__region"
                            onClick={() => choose(region.id)}
                          >
                            <LanguageFlag locale={region.id} />
                            <span>{region.nativeLabel}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
