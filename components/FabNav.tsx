"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUp, Home, Mail } from "lucide-react";
import { UniversalAccess } from "react-bootstrap-icons";

/**
 * Mobile floating action navigation. All entries are page routes now that the
 * site is multi-page — the previous in-page anchor scroll behavior is gone.
 *
 * Contact is intentionally not in this list: it's promoted to a primary CTA
 * button rendered below the menu so it reads as an action, not a tab. See
 * the `Contact CTA` block further down in the JSX.
 */
const navItems = [
  { name: "Home", href: "/", ariaLabel: "Go to Home" },
  { name: "Experience", href: "/experience", ariaLabel: "Open Experience page" },
  { name: "Portfolio", href: "/portfolio", ariaLabel: "Open Portfolio page" },
  { name: "Evidence", href: "/evidence", ariaLabel: "Open Evidence page" },
  { name: "Resume", href: "/resume", ariaLabel: "Open Resume page" },
];

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const liquidSpring = { type: "spring" as const, stiffness: 200, damping: 22 };
const liquidSpringReduced = { type: "spring" as const, stiffness: 320, damping: 28 };

type FabNavProps = {
  onOpenAccessibility?: () => void;
};

export default function FabNav({ onOpenAccessibility }: FabNavProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const SCROLL_IDLE_MS = 1500;
    const TOP_THRESHOLD_PX = 80;

    const handleScroll = () => {
      const atTop = typeof window !== "undefined" && window.scrollY < TOP_THRESHOLD_PX;
      if (atTop) {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
        setShowFab(false);
        return;
      }
      setShowFab(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setShowFab(false), SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const showFabs = showFab && !open;

  const springConfig = shouldReduceMotion ? liquidSpringReduced : liquidSpring;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      {/* Desktop / tablet accessibility FAB — bottom-left, md+ only.
          Promoted out of the top nav so the header stays a clean wordmark.
          Glass treatment matches the existing FabNav family. */}
      {onOpenAccessibility && (
        <motion.button
          type="button"
          onClick={onOpenAccessibility}
          aria-label="Open accessibility settings"
          aria-haspopup="dialog"
          className="a11y-fab hidden md:inline-flex glass-circle-btn fixed bottom-6 left-6 z-50 h-12 w-12 lg:h-[52px] lg:w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[var(--primary)] shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-black/55 dark:backdrop-blur-md dark:shadow-[inset_0_-4px_14px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.08)]"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springConfig, delay: shouldReduceMotion ? 0 : 0.2 }}
          whileHover={shouldReduceMotion ? {} : { scale: 1.06, y: -2 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
        >
          <UniversalAccess className="h-6 w-6 lg:h-[26px] lg:w-[26px] fill-current" aria-hidden />
          <span className="a11y-fab-tooltip" aria-hidden="true">
            Accessibility
          </span>
        </motion.button>
      )}

      {/* Mobile menu button: bottom-left corner */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="glass-circle-btn md:hidden fixed bottom-6 left-6 z-50 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[var(--primary)] shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-black/50 dark:backdrop-blur-md dark:shadow-[inset_0_-4px_14px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.08)]"
        aria-expanded={open}
        aria-controls="fab-nav-menu"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        transition={springConfig}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={springConfig}
            >
              <X className="h-6 w-6" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={springConfig}
            >
              <Menu className="h-6 w-6" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Back to top: bottom-right corner, same size as menu button (h-14 w-14) for symmetry */}
      <AnimatePresence>
        {showFabs && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            className="glass-circle-btn fixed bottom-6 right-6 z-50 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-[var(--primary)] shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-black/50 dark:backdrop-blur-md dark:shadow-[inset_0_-4px_14px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.08)]"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={springConfig}
            whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          >
            <ArrowUp className="h-6 w-6" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Light dim only (no blur) — content behind stays visible for glass effect */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/15"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              id="fab-nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fab-nav-glass fixed inset-x-0 bottom-0 z-40 flex min-h-[52vh] w-full flex-col rounded-t-[2rem] shadow-2xl"
              initial={{
                y: "100%",
                scaleY: 0.6,
                scaleX: 0.95,
                borderRadius: "48% 48% 0 0",
                opacity: 0.92,
              }}
              animate={{
                y: 0,
                scaleY: 1,
                scaleX: 1,
                borderRadius: "2rem 2rem 0 0",
                opacity: 1,
              }}
              exit={{
                y: "100%",
                scaleY: 0.7,
                scaleX: 0.97,
                borderRadius: "48% 48% 0 0",
                opacity: 0.94,
              }}
              transition={springConfig}
              style={{ transformOrigin: "bottom center" }}
            >
              {/* Reflection — gradient at top edge */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-[2rem] bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent"
                aria-hidden
              />
              {/* Refraction + Frost: backdrop blur (refraction 80%, frost 4) */}
              <div
                className="fab-nav-glass-layer absolute inset-0 rounded-t-[2rem]"
                aria-hidden
              />
              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col">
              <nav className="w-full flex-1 px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10" aria-label="Quick navigation">
                <ul className="mx-auto flex max-w-sm flex-col gap-3 sm:gap-4">
                  {navItems.map((item, i) => {
                    const isActive = isLinkActive(pathname, item.href);
                    const isHomeItem = item.href === "/";
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{
                          ...springConfig,
                          delay: 0.03 * i,
                          opacity: { duration: 0.2 },
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-label={item.ariaLabel}
                          aria-current={isActive ? "page" : undefined}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:px-6 sm:py-4 sm:text-lg ${
                            isActive
                              ? "bg-[var(--primary)] text-white"
                              : "bg-[var(--bg-secondary)]/90 text-[var(--foreground)] hover:bg-[var(--bg-tertiary)]/90 backdrop-blur-sm"
                          }`}
                        >
                          {isHomeItem && <Home className="h-5 w-5" aria-hidden="true" />}
                          {item.name}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Contact CTA — promoted out of the menu list as a primary
                    action. Filled-primary pill sits below the route list so
                    it reads as the "talk to Anthony" button, not just another
                    tab. Animates in after the last menu row. */}
                <motion.div
                  className="mx-auto mt-5 w-full max-w-sm sm:mt-6"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    ...springConfig,
                    delay: 0.03 * navItems.length,
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    aria-label="Open Contact page"
                    aria-current={
                      isLinkActive(pathname, "/contact") ? "page" : undefined
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:px-6 sm:py-4 sm:text-lg"
                  >
                    <Mail className="h-5 w-5" aria-hidden />
                    Contact
                  </Link>
                </motion.div>
              </nav>
              {/* Accessibility: bottom-right of menu (so it doesn’t overlap the close button on the left) */}
              {onOpenAccessibility && (
                <motion.button
                  type="button"
                  onClick={() => {
                    onOpenAccessibility();
                    setOpen(false);
                  }}
                  aria-label="Open accessibility settings"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ ...springConfig, delay: 0.03 * navItems.length, opacity: { duration: 0.2 } }}
                  className="glass-circle-btn absolute bottom-6 right-6 rounded-full h-14 w-14 flex-shrink-0 inline-flex items-center justify-center bg-white/80 backdrop-blur-md text-[var(--primary)] shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.9)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] z-10 md:hidden dark:bg-black/50 dark:backdrop-blur-md dark:shadow-[inset_0_-4px_14px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.08)]"
                >
                  <UniversalAccess className="h-6 w-6 fill-current" aria-hidden />
                </motion.button>
              )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
