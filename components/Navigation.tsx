"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Home, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

const cineEase = [0.22, 1, 0.36, 1] as const;

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Navigation — floating "Menu" control + cinematic chapter overlay.
 *
 * Contrast: frosted triggers use near-opaque fills so text contrast is against
 * the control surface (WCAG 2.2 AAA), not whatever sits behind the blur.
 *
 * Hit-testing: the outer shell is `pointer-events-none` and only the control
 * cluster (`w-fit`) re-enables events — so sticky page chrome (e.g. Experience
 * tabs) stays clickable underneath the empty top strip.
 */
type NavigationProps = {
  onOpenAccessibility?: () => void;
};

export default function Navigation({ onOpenAccessibility }: NavigationProps) {
  const pathname = usePathname() ?? "/";
  const shouldReduceMotion = useReducedMotion();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const onMedia = isHome;
  const triggerTone = onMedia ? "site-menu-trigger--on-media" : "site-menu-trigger--surface";
  const iconTone = onMedia ? "site-menu-icon-btn--on-media" : "site-menu-icon-btn--surface";

  return (
    <>
      <div
        id="main-nav"
        className="pointer-events-none fixed top-0 inset-x-0 z-50"
      >
        <div className="flex justify-end px-[var(--hp-cine-pad,1.25rem)] pt-5">
          <div className="pointer-events-auto flex w-fit items-center gap-2">
            {onOpenAccessibility && (
              <button
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
              className="flex flex-1 flex-col justify-center px-[var(--hp-cine-pad,1.25rem)] pb-16"
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
