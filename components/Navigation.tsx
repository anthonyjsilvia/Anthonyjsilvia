"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Experience", href: "#experience" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Resume", href: "/resume.pdf", external: true },
  { name: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll <= 0 ? 0 : Math.min(1, scrollY / maxScroll);
      if (navRef.current) {
        navRef.current.style.setProperty("--scroll-progress", String(progress));
        navRef.current.dataset.progressHigh = progress > 0.5 ? "true" : "false";
      }
      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [shouldReduceMotion]);

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="nav-scroll-root fixed top-4 left-4 right-4 z-40 rounded-[32px] overflow-hidden shadow-lg border border-[var(--border-light)] backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Base layer (unfilled area) */}
      <div
        className="absolute inset-0 bg-white/95 dark:bg-black/95"
        aria-hidden="true"
      />
      {/* Blue progress fill — width driven by CSS variable for smooth updates */}
      <div
        className="nav-progress-fill absolute inset-y-0 left-0 bg-[var(--primary)]"
        aria-hidden="true"
      />

      {/* Single full-width gradient wrapper so text aligns with blue fill */}
      <div className="nav-gradient-text w-full relative z-10">
        <div className="w-full px-4 sm:px-5">
          <div className="flex justify-between items-center h-16 md:h-20">
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#hero");
              }}
              className="text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-transparent rounded-lg inline-block"
              style={{ color: "inherit" }}
              aria-label="Anthony Silvia - Home"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              Anthony Silvia
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-lg px-2 py-1 hover:opacity-80 inline-block"
                  style={{ color: "inherit" }}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  aria-label={`Navigate to ${item.name}${item.external ? " (opens in new tab)" : ""}`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button — icon color via CSS from data-progress-high */}
            <button
              className="nav-menu-icon md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-white/98 dark:bg-black/98 border-t border-[var(--border-light)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2 rounded-b-[32px]">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.external) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="block px-4 py-3 text-[var(--text-primary)] dark:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-secondary)] rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  aria-label={`Navigate to ${item.name}${item.external ? " (opens in new tab)" : ""}`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
