"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SiteSearch from "@/components/SiteSearch";

/**
 * Top-level navigation items. Every entry is a real page route — the site is
 * multi-page now, so there are no in-page anchor links to track.
 *
 * Contact is intentionally not in this list — it's promoted to a primary CTA
 * button rendered to the right of the menu (see the Contact CTA in JSX below).
 */
const navItems = [
  { name: "Experience", href: "/experience" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Evidence", href: "/evidence" },
  { name: "Resume", href: "/resume" },
];

/**
 * `true` when the given href is the current route (exact match) or a parent of
 * the current route (so `/portfolio/case-x` highlights `/portfolio`).
 */
function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * iOS 26-style "liquid pill" spring. Snappy enough to feel responsive, with
 * just enough overshoot (low damping relative to stiffness, moderate mass) to
 * give the pill that wet, jelly-like settle when it lands on a new item.
 *
 * Tuning notes:
 *   • stiffness ↑ = arrives faster, more rigid
 *   • damping ↓   = more bounce / wobble
 *   • mass ↑     = heavier feel, more inertia
 */
const liquidSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 24,
  mass: 0.7,
};

type PillRect = {
  /** Pixel offset of the pill's left edge from the start of the items row. */
  left: number;
  /** Pill width — matches the underlying item's width. */
  width: number;
  /** Whether the pill should be visible (false on home with no hover). */
  visible: boolean;
};

const INITIAL_PILL: PillRect = { left: 0, width: 0, visible: false };

/**
 * Navigation — full-width Liquid Glass header bar with an iOS 26-style
 * morphing pill indicator.
 *
 * Hovering or focusing a desktop nav item slides the primary-color "liquid
 * pill" (with spring physics + slight bounce) from the active route to the
 * hovered item. On mouse leave, the pill springs back to the active route.
 * On `/` (home, no active nav item) the pill gently appears on hover and
 * fades + scales out on leave.
 *
 * The pill width morphs to fit each item because the items have different
 * label lengths — that horizontal-stretch is what gives the motion its
 * actual liquid quality. Spring physics handle the rest.
 *
 * Reduced-motion: pill becomes a static block at the active route only;
 * hover does nothing.
 */
export default function Navigation() {
  const pathname = usePathname() ?? "/";
  const shouldReduceMotion = useReducedMotion();
  const isHome = pathname === "/";

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pill, setPill] = useState<PillRect>(INITIAL_PILL);

  const activeIdx = navItems.findIndex((item) => isLinkActive(pathname, item.href));
  // Hover wins; fall back to the active route; -1 means "no pill anywhere".
  const pillIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  /**
   * Measure the target item and update the pill's rect. Re-measures whenever
   * `pillIdx` changes (hover / active route changes) and on window resize so
   * the pill stays glued to the right item across layout shifts.
   */
  useEffect(() => {
    if (pillIdx < 0) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }

    const measure = () => {
      const el = itemRefs.current[pillIdx];
      if (!el) return;
      setPill({
        left: el.offsetLeft,
        width: el.offsetWidth,
        visible: true,
      });
    };

    // Defer one tick so the items have laid out (matters on first render).
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [pillIdx]);

  return (
    <nav
      id="main-nav"
      role="navigation"
      aria-label="Main navigation"
      className="nav-liquid-glass fixed top-0 inset-x-0 z-40"
    >
      <div className="mx-auto w-full max-w-7xl h-16 sm:h-[68px] flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand — refined wordmark. Just the name. */}
        <Link
          href="/"
          aria-label="Anthony Silvia — Home"
          aria-current={isHome ? "page" : undefined}
          className="nav-wordmark inline-flex items-baseline -ml-1 px-2 py-1 rounded-lg text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <span className="text-[15px] sm:text-base md:text-[17px] font-semibold tracking-[-0.01em] leading-none">
            Anthony Silvia
          </span>
        </Link>

        {/* Right cluster — menu, search trigger, and Contact CTA. They're
            grouped in one flex row so `justify-between` on the outer container
            keeps the brand pinned left and this whole cluster pinned right. */}
        <div className="flex items-center gap-2 md:gap-3">
        {/*
          Desktop / tablet links. The <ul> is a positioning context for the
          floating pill; each <li> is measured (offsetLeft + offsetWidth) and
          the pill animates to whichever one is hovered (or to the active
          route at rest). `onMouseLeave` on the list clears `hoveredIdx` so
          the pill springs back to the active route — not to the last hovered
          item.
        */}
        <ul
          role="list"
          className="hidden md:flex items-center gap-0.5 relative"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Liquid pill — single element, animated via {left, width, opacity, scale}.
              Spring physics + width-morph = liquid feel.

              Centering note: we cannot use a `translateY(-50%)` CSS transform
              here because animating `scale` makes framer-motion fully own the
              transform string, which would wipe out the translate. Instead
              the pill is centered explicitly with `top: calc(50% - 17px)`,
              where 17px is half the pill height (34px).
          */}
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              className="nav-liquid-pill absolute top-[calc(50%-17px)] h-[34px] rounded-full bg-[var(--primary)] pointer-events-none"
              initial={false}
              animate={{
                left: pill.left,
                width: pill.width,
                opacity: pill.visible ? 1 : 0,
                // Subtle scale-from-nothing on home-page hover entry; at rest
                // the pill is always full-scale so the morph between items
                // doesn't change scale (which would feel like a glitch).
                scale: pill.visible ? 1 : 0.85,
              }}
              transition={{
                left: liquidSpring,
                width: liquidSpring,
                opacity: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
            />
          )}

          {/* Reduced-motion fallback: static pill at the active route only,
              positioned via plain CSS inside its <li>. No hover preview. */}

          {navItems.map((item, idx) => {
            const isActive = isLinkActive(pathname, item.href);
            const isUnderPill = !shouldReduceMotion && idx === pillIdx;
            const reducedMotionPill = shouldReduceMotion && isActive;
            // The pill has left this item to follow the user's cursor /
            // focus elsewhere. Show a quiet outline on the active route so
            // the user can still see which page they're on while previewing
            // others.
            const showActiveOutline =
              !shouldReduceMotion && isActive && pillIdx !== activeIdx;

            // Text-color rules:
            //   • Under the (animated or reduced-motion) pill → white
            //   • Active route with the pill elsewhere → primary color
            //     (matches the outline; reads as "this is your page")
            //   • Otherwise → secondary text, deepens to primary text on hover
            let textColorClass: string;
            if (isUnderPill || reducedMotionPill) {
              textColorClass = "text-white";
            } else if (showActiveOutline) {
              textColorClass = "text-[var(--primary)]";
            } else {
              textColorClass =
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]";
            }

            return (
              <li
                key={item.name}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                className="relative"
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {/* Static pill for reduced-motion: simply marks the active
                    route with a filled primary block. No animation. */}
                {reducedMotionPill && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[34px] rounded-full bg-[var(--primary)] pointer-events-none"
                  />
                )}

                {/* Active-route outline — appears when the liquid pill has
                    moved off the active item, so the user still has a clear
                    "you are here" cue. Fades in/out with an Apple ease so the
                    handoff between pill-and-outline feels coordinated. */}
                {isActive && !shouldReduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-[calc(50%-17px)] h-[34px] rounded-full border-[1.5px] border-[var(--primary)] pointer-events-none"
                    initial={false}
                    animate={{ opacity: showActiveOutline ? 1 : 0 }}
                    transition={{
                      duration: 0.22,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}

                <Link
                  href={item.href}
                  aria-label={`Go to ${item.name} page`}
                  aria-current={isActive ? "page" : undefined}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  // `inline-flex items-center h-[34px] leading-none`:
                  // pins the link box to exactly the same height as the
                  // liquid pill (34px), with the label vertically centered
                  // via flex. This is what guarantees the pill sits behind
                  // the text rather than floating above or below it.
                  className={`relative z-10 inline-flex items-center h-[34px] px-3.5 rounded-full text-[13px] font-medium tracking-[0.005em] leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] transition-colors duration-200 ${textColorClass}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Site search — trigger pill + ⌘K palette. Hidden on the tightest
            phones; from `sm:` up it sits between the menu and the Contact
            CTA so the nav reads as: brand · menu · search · contact. */}
        <div className="hidden sm:block">
          <SiteSearch />
        </div>

        {/* Contact CTA — promoted out of the menu so it reads as a primary
            action, not a tab. Solid primary fill, white label, full text on
            md+ and an icon-plus-short-label fallback on phones. */}
        <Link
          href="/contact"
          aria-label="Open Contact page"
          aria-current={pathname === "/contact" || pathname.startsWith("/contact/") ? "page" : undefined}
          className="nav-contact-cta inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:px-4 sm:py-2"
        >
          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
          Contact
        </Link>
        </div>
      </div>
    </nav>
  );
}
