"use client";

import { useId, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/languages";

function FlagDisc({ children }: { children: ReactNode }) {
  const clipId = `flag-${useId().replace(/:/g, "")}`;

  return (
    <span className="language-flag" aria-hidden="true">
      <svg viewBox="0 0 60 60">
        <defs>
          <clipPath id={clipId}>
            <circle cx="30" cy="30" r="30" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>{children}</g>
      </svg>
    </span>
  );
}

/** Circular flag that fills its button. SVG so it reads the same on every platform. */
export default function LanguageFlag({ locale }: { locale: Locale }) {
  if (locale === "en-GB") {
    return (
      <FlagDisc>
        <rect width="60" height="60" fill="#012169" />
        <path d="M0 0 L60 60 M60 0 L0 60" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M0 0 L60 60 M60 0 L0 60" stroke="#C8102E" strokeWidth="6" />
        <path d="M30 0 V60 M0 30 H60" stroke="#FFFFFF" strokeWidth="18" />
        <path d="M30 0 V60 M0 30 H60" stroke="#C8102E" strokeWidth="10" />
      </FlagDisc>
    );
  }

  if (locale === "es-ES") {
    return (
      <FlagDisc>
        <rect width="60" height="60" fill="#AA151B" />
        <rect y="20" width="60" height="20" fill="#F1BF00" />
      </FlagDisc>
    );
  }

  if (locale === "es-MX") {
    return (
      <FlagDisc>
        <rect width="20" height="60" fill="#006847" />
        <rect x="20" width="20" height="60" fill="#FFFFFF" />
        <rect x="40" width="20" height="60" fill="#CE1126" />
        <circle cx="30" cy="33" r="6" fill="#C4A35A" />
        <path d="M30 22 l2.4 7 h-4.8 z" fill="#0B6A3A" />
        <path d="M25.2 26 l2.2 6 h-3.4 z" fill="#0B6A3A" />
        <path d="M34.8 26 l1.2 6 h-3.4 z" fill="#0B6A3A" />
      </FlagDisc>
    );
  }

  if (locale === "pt-PT") {
    return (
      <FlagDisc>
        <rect width="24" height="60" fill="#006600" />
        <rect x="24" width="36" height="60" fill="#FF0000" />
        <circle cx="24" cy="30" r="11" fill="none" stroke="#FFCC00" strokeWidth="3.2" />
        <circle cx="24" cy="30" r="4.2" fill="#FFCC00" />
      </FlagDisc>
    );
  }

  if (locale === "pt-BR") {
    return (
      <FlagDisc>
        <rect width="60" height="60" fill="#009C3B" />
        <polygon points="30,5 55,30 30,55 5,30" fill="#FFDF00" />
        <circle cx="30" cy="30" r="12" fill="#002776" />
        <path d="M19 33c6-7 16-7 22 0" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      </FlagDisc>
    );
  }

  return (
    <FlagDisc>
      <rect width="60" height="60" fill="#B22234" />
      <rect y="4.6" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="13.8" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="23" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="32.3" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="41.5" width="60" height="4.6" fill="#FFFFFF" />
      <rect y="50.8" width="60" height="4.6" fill="#FFFFFF" />
      <rect width="27" height="27.6" fill="#3C3B6E" />
    </FlagDisc>
  );
}
