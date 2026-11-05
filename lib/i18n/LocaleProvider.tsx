"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMessages, type Messages } from "@/lib/i18n/catalog";
import {
  localeMeta,
  migrateLocale,
  type Locale,
} from "@/lib/i18n/languages";

const STORAGE_KEY = "site-locale";

type LocaleContextValue = {
  locale: Locale;
  country: string | null;
  setLocale: (locale: Locale) => void;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(next: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Private mode can block storage; the cookie and in-memory choice still apply. */
  }
  document.cookie = `site-locale=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function readStoredLocale(): Locale | null {
  try {
    return migrateLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function LocaleProvider({
  children,
  country,
  initialLocale,
}: {
  children: ReactNode;
  country: string | null;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = readStoredLocale();
    if (!stored) return;
    if (stored !== initialLocale) setLocaleState(stored);
    persistLocale(stored);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeMeta(locale).htmlLang;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, country, setLocale, messages: getMessages(locale) }),
    [locale, country, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return value;
}

export function useMessages(): Messages {
  return useLocale().messages;
}
