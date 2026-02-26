"use client";

/**
 * Accessibility settings persisted in a cookie so preferences survive refresh
 * and can be read server-side if needed later.
 */
const COOKIE_NAME = "accessibility_settings";
const COOKIE_MAX_AGE_DAYS = 365;
const COOKIE_PATH = "/";

export type ColorScheme = "system" | "light" | "dark";

export type AccessibilitySettings = {
  reduceTransparency: boolean;
  reduceMotion: boolean;
  openDyslexic: boolean;
  colorScheme: ColorScheme;
};

const DEFAULTS: AccessibilitySettings = {
  reduceTransparency: false,
  reduceMotion: false,
  openDyslexic: false,
  colorScheme: "system",
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1).trim());
}

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(value);
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encoded}; path=${COOKIE_PATH}; max-age=${maxAge}; SameSite=Lax`;
}

export function getAccessibilitySettings(): AccessibilitySettings {
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return { ...DEFAULTS };
  try {
    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
    return {
      reduceTransparency: !!parsed.reduceTransparency,
      reduceMotion: !!parsed.reduceMotion,
      openDyslexic: !!parsed.openDyslexic,
      colorScheme:
        parsed.colorScheme === "light" || parsed.colorScheme === "dark"
          ? parsed.colorScheme
          : "system",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setAccessibilitySettings(settings: AccessibilitySettings): void {
  setCookie(COOKIE_NAME, JSON.stringify(settings));
}

export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.classList.toggle("reduce-transparency", settings.reduceTransparency);
  root.classList.toggle("force-reduce-motion", settings.reduceMotion);
  root.classList.toggle("use-open-dyslexic", settings.openDyslexic);

  // Color scheme: system (OS-aware), light, or dark
  root.classList.remove("color-scheme-light", "color-scheme-dark");
  if (settings.colorScheme === "light") {
    stopColorSchemeSystemListener();
    root.classList.add("color-scheme-light");
    root.classList.remove("dark");
  } else if (settings.colorScheme === "dark") {
    stopColorSchemeSystemListener();
    root.classList.add("color-scheme-dark");
    root.classList.add("dark");
  } else {
    root.classList.remove("dark"); // will be set by subscribeColorSchemeSystem
    subscribeColorSchemeSystem();
  }
}

let systemListener: (() => void) | null = null;

function subscribeColorSchemeSystem(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  systemListener?.();
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", mq.matches);
  apply();
  mq.addEventListener("change", apply);
  systemListener = () => {
    mq.removeEventListener("change", apply);
    systemListener = null;
  };
}

export function stopColorSchemeSystemListener(): void {
  systemListener?.();
}
