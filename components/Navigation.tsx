"use client";

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg border-b border-[var(--border-light)]"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="text-xl md:text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
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
                className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded px-2 py-1"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                aria-label={`Navigate to ${item.name}${item.external ? " (opens in new tab)" : ""}`}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--text-primary)] dark:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-white dark:bg-black border-t border-[var(--border-light)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
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
