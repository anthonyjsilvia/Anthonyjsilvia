"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUp } from "lucide-react";

const navItems = [
  { name: "Experience", href: "#experience" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Evidence", href: "/evidence", internalPage: true },
  { name: "Resume", href: "/resume.pdf", external: true },
  { name: "Contact", href: "#contact" },
];

const liquidSpring = { type: "spring" as const, stiffness: 200, damping: 22 };
const liquidSpringReduced = { type: "spring" as const, stiffness: 320, damping: 28 };

export default function FabNav() {
  const pathname = usePathname();
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
    handleScroll(); // run once in case page loads scrolled
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const showFabs = showFab && !open;

  const springConfig = shouldReduceMotion ? liquidSpringReduced : liquidSpring;

  const handleLinkClick = (item: (typeof navItems)[number]) => {
    if (!("internalPage" in item && item.internalPage) && !item.external) {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
    setOpen(false);
  };

  const scrollToTop = () => {
    const hero = document.getElementById("hero");
    if (hero) hero.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <>
      {/* FAB stack: back-to-top on all screens when scrolling; menu button mobile only */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
        <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
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
        <AnimatePresence>
          {showFabs && (
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              aria-label="Back to top"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={springConfig}
              whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </motion.a>
          )}
        </AnimatePresence>
      </div>

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
                    const isActive =
                      "internalPage" in item && item.internalPage
                        ? pathname === "/evidence"
                        : false;
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
                        <a
                          href={item.href}
                          onClick={(e) => {
                            if (!item.external && !("internalPage" in item && item.internalPage)) {
                              e.preventDefault();
                              handleLinkClick(item);
                            } else {
                              setOpen(false);
                            }
                          }}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:px-6 sm:py-4 sm:text-lg ${
                            isActive
                              ? "bg-[var(--primary)] text-white"
                              : "bg-[var(--bg-secondary)]/90 text-[var(--foreground)] hover:bg-[var(--bg-tertiary)]/90 backdrop-blur-sm"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
