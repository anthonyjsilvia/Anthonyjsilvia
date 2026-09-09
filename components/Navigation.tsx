"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Home, X } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { UniversalAccess } from "react-bootstrap-icons";
import SiteSearch from "@/components/SiteSearch";

/**
 * Site destinations shown in the full-screen Menu overlay.
 * Replaces the old liquid-glass top bar site-wide.
 */
const menuItems = [
  { name: "Home", href: "/" },
  { name: "Experience", href: "/experience" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Evidence", href: "/evidence" },
  { name: "AI practice", href: "/#ai" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

const cineEase = [0.22, 1, 0.36, 1] as const;

/** Minimum clear space between left chrome (tabs / back) and the Menu cluster. */
const CLUSTER_MIN_GAP_PX = 12;
/** Extra slack before restoring a suppressed control (avoids flicker). */
const CLUSTER_RESTORE_SLACK_PX = 20;
/** Fallback width for the Accessibility control + gap when it isn't mounted. */
const A11Y_SLOT_FALLBACK_PX = 56;

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function getLeftChromeRect(): DOMRect | null {
  const leftInteractive = document.querySelector(
    "[data-experience-chapters-control], [data-site-back-bar] .pointer-events-auto, [data-recommendation-back] .pointer-events-auto",
  ) as HTMLElement | null;
  return leftInteractive?.getBoundingClientRect() ?? null;
}

/**
 * Navigation - floating "Menu" control + cinematic chapter overlay.
 *
 * Contrast: frosted triggers use near-opaque fills so text contrast is against
 * the control surface (WCAG 2.2 AAA), not whatever sits behind the blur.
 *
 * Hit-testing: the outer shell is `pointer-events-none` and only the control
 * cluster (`w-fit`) re-enables events - so sticky page chrome (e.g. Experience
 * tabs) stays clickable underneath the empty top strip.
 *
 * Overflow: when the top-right cluster would collide with left chrome (or the
 * viewport edge), Accessibility is suppressed into the Menu overlay first -
 * macOS menu-bar style, only when space is actually needed.
 */
type NavigationProps = {
  onOpenAccessibility?: () => void;
};

export default function Navigation({ onOpenAccessibility }: NavigationProps) {
  const pathname = usePathname() ?? "/";
  const shouldReduceMotion = useReducedMotion();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [suppressA11y, setSuppressA11y] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const a11yRef = useRef<HTMLButtonElement>(null);
  const a11ySlotWidthRef = useRef(A11Y_SLOT_FALLBACK_PX);
  const suppressA11yRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    suppressA11yRef.current = suppressA11y;
  }, [suppressA11y]);

  const measureOverflow = useCallback(() => {
    const cluster = clusterRef.current;
    if (!cluster || !onOpenAccessibility) {
      setSuppressA11y(false);
      return;
    }

    // Keep a live measure of the a11y control width while it's in the bar.
    if (a11yRef.current && !suppressA11yRef.current) {
      const styles = getComputedStyle(cluster);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "8") || 8;
      a11ySlotWidthRef.current = a11yRef.current.getBoundingClientRect().width + gap;
    }

    const clusterRect = cluster.getBoundingClientRect();
    const leftRect = getLeftChromeRect();
    const slot = a11ySlotWidthRef.current;
    const currentlySuppressed = suppressA11yRef.current;

    // Cluster is justify-end anchored: suppressing a11y moves its left edge right.
    // Evaluate collision as if Accessibility were visible in the bar.
    const clusterLeftIfA11yShown = currentlySuppressed
      ? clusterRect.left - slot
      : clusterRect.left;

    let wouldCollide = false;

    if (leftRect) {
      const gap = clusterLeftIfA11yShown - leftRect.right;
      wouldCollide = gap < CLUSTER_MIN_GAP_PX;
    }

    // Also collapse if the full cluster would clip into the left safe inset.
    const shell = cluster.parentElement;
    const pad = shell
      ? Number.parseFloat(getComputedStyle(shell).paddingLeft) || 20
      : 20;
    if (clusterLeftIfA11yShown < pad - 1) {
      wouldCollide = true;
    }

    setSuppressA11y((prev) => {
      if (wouldCollide) return true;
      if (!prev) return false;

      // Restore only when there's clear room again (hysteresis).
      if (leftRect) {
        const gapIfShown = clusterLeftIfA11yShown - leftRect.right;
        return gapIfShown < CLUSTER_MIN_GAP_PX + CLUSTER_RESTORE_SLACK_PX;
      }
      return clusterLeftIfA11yShown < pad + CLUSTER_RESTORE_SLACK_PX;
    });
  }, [onOpenAccessibility]);

  useLayoutEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measureOverflow);
    };

    schedule();
    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver(schedule);
    if (clusterRef.current) observer.observe(clusterRef.current);

    // Left chrome (Experience tabs / recommendation back) mounts via portal
    // after paint - watch the tree so we remeasure when it appears.
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      mutation.disconnect();
    };
  }, [measureOverflow, pathname, isHome]);

  const onMedia = isHome;
  const triggerTone = onMedia ? "site-menu-trigger--on-media" : "site-menu-trigger--surface";
  const iconTone = onMedia ? "site-menu-icon-btn--on-media" : "site-menu-icon-btn--surface";
  const a11yInMenu = Boolean(onOpenAccessibility && suppressA11y);

  return (
    <>
      <div
        id="main-nav"
        className="pointer-events-none fixed top-0 inset-x-0 z-50"
      >
        <div className="flex justify-end px-[var(--hp-cine-pad,1.25rem)] pt-5">
          <div
            ref={clusterRef}
            data-site-menu-cluster
            className="pointer-events-auto flex w-fit items-center gap-2"
          >
            {onOpenAccessibility && !suppressA11y && (
              <button
                ref={a11yRef}
                type="button"
                onClick={onOpenAccessibility}
                aria-label="Open accessibility settings"
                aria-haspopup="dialog"
                title="Accessibility"
                className={`site-menu-icon-btn ${iconTone}`}
              >
                <UniversalAccess className="h-4 w-4 fill-current" aria-hidden />
              </button>
            )}
            <SiteSearch
              triggerClassName={`site-menu-icon-btn ${iconTone}`}
            />
            {!isHome && (
              <Link
                href="/"
                aria-label="Go to homepage"
                title="Home"
                className={`site-menu-icon-btn ${iconTone}`}
              >
                <Home className="h-4 w-4" aria-hidden />
              </Link>
            )}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu-overlay"
              aria-haspopup="dialog"
              aria-label="Open menu"
              className={`site-menu-trigger ${triggerTone}`}
            >
              <span aria-hidden="true" className="site-menu-trigger__icon">
                <span />
                <span />
                <span />
              </span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="site-menu-overlay"
            id="site-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="site-menu-overlay fixed inset-0 z-[60] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: cineEase }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="flex items-center justify-between px-[var(--hp-cine-pad,1.25rem)] pt-5 pb-2">
              <p
                id={titleId}
                className="site-menu-overlay__eyebrow font-display text-[11px] font-bold uppercase tracking-[0.22em]"
              >
                Menu
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="site-menu-overlay__close inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Main navigation"
              className="flex flex-1 flex-col justify-center px-[var(--hp-cine-pad,1.25rem)] pb-8"
            >
              <ul role="list" className="mx-auto w-full max-w-3xl space-y-1 sm:space-y-2">
                {menuItems.map((item, idx) => {
                  const isActive = isLinkActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : 24,
                        filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
                      }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.7,
                        delay: shouldReduceMotion ? 0 : 0.06 + idx * 0.05,
                        ease: cineEase,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={isActive ? "page" : undefined}
                        className="site-menu-overlay__link group flex items-baseline gap-4 rounded-lg py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a12]"
                      >
                        <span
                          aria-hidden="true"
                          className="site-menu-overlay__index w-8 shrink-0 font-mono text-xs transition-colors"
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="site-menu-overlay__label font-display text-[clamp(2rem,5.5vw,3.75rem)] font-extrabold tracking-[-0.045em] leading-[1.05] transition-transform duration-300 group-hover:translate-x-1">
                          {item.name}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {a11yInMenu && onOpenAccessibility && (
              <div className="px-[var(--hp-cine-pad,1.25rem)] pb-10">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onOpenAccessibility();
                  }}
                  aria-label="Open accessibility settings"
                  aria-haspopup="dialog"
                  className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-5 py-4 text-left text-white transition-colors hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a12]"
                >
                  <UniversalAccess className="h-5 w-5 shrink-0 fill-current" aria-hidden />
                  <span className="font-display text-sm font-bold uppercase tracking-[0.18em]">
                    Accessibility
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
