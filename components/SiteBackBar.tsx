"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMessages } from "@/lib/i18n/LocaleProvider";

type SiteBackBarProps = {
  href: string;
  kind?: "portfolio" | "recommendations";
};

/**
 * Fixed top-left back control.
 *
 * Portaled to `document.body` so `position: fixed` pins to the viewport,
 * not to `<main class="apple-reveal">`, whose entrance animation can create
 * a containing block for fixed descendants (same pattern as Experience tabs).
 */
export default function SiteBackBar({ href, kind = "portfolio" }: SiteBackBarProps) {
  const chrome = useMessages().chrome;
  const label =
    kind === "recommendations" ? chrome.backToRecommendations : chrome.backToPortfolio;
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const bar = (
    <div
      className="pointer-events-none fixed top-0 inset-x-0 z-40"
      data-site-back-bar
    >
      <div className="flex justify-start pt-5">
        <Link
          href={href}
          aria-label={label}
          style={{
            marginLeft: "var(--site-menu-end, var(--hp-cine-pad, 1.25rem))",
            maxWidth:
              "max(0px, calc(var(--site-tools-start, 100vw) - var(--site-menu-end, 1.25rem)))",
          }}
          className="exp-chapter-tab exp-chapter-tab--idle pointer-events-auto"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </Link>
      </div>
    </div>
  );

  return portalReady ? createPortal(bar, document.body) : null;
}
