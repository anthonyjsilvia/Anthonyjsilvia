"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { UniversalAccess } from "react-bootstrap-icons";

const navItems = [
  { name: "Experience", href: "#experience" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Evidence", href: "/evidence", internalPage: true },
  { name: "Resume", href: "/resume.pdf", external: true },
  { name: "Contact", href: "#contact" },
];

/** Section IDs that can be "under" the nav; order matches page flow. */
const COVER_SECTION_IDS = ["hero", "about", "experience", "portfolio", "education", "recommendations", "contact"] as const;

/** Vertical offset from top of viewport to the point we use to decide which section is under the nav (nav bar center). */
const COVER_OFFSET_PX = 100;

/** Scroll down past this (px) to collapse nav on mobile; scroll up reveals it again. */
const MOBILE_COLLAPSE_SCROLL_THRESHOLD = 60;

type CoverState = "hero" | "default" | "secondary";

function getCoverState(sectionId: string | null): CoverState {
  if (sectionId === "hero") return "hero";
  if (sectionId === "experience" || sectionId === "education") return "secondary";
  return "default";
}

type NavigationProps = {
  onOpenAccessibility?: () => void;
};

export default function Navigation({ onOpenAccessibility }: NavigationProps) {
  const pathname = usePathname();
  const [coverState, setCoverState] = useState<CoverState>("default");
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
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
  }, []);

  /* Mobile viewport: only collapse nav on small screens (match md: 768px) */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== "undefined" && window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setNavCollapsed(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* Safari-like: on mobile, collapse to 4px progress bar when scrolling down, expand when scrolling up */
  useEffect(() => {
    if (!isMobile) return;
    const handleScrollCollapse = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;
      if (scrollY <= MOBILE_COLLAPSE_SCROLL_THRESHOLD) {
        setNavCollapsed(false);
      } else if (delta > 8) {
        setNavCollapsed(true);
      } else if (delta < -8) {
        setNavCollapsed(false);
      }
    };
    lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
    window.addEventListener("scroll", handleScrollCollapse, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollCollapse);
  }, [isMobile]);

  /* Cover state and current section: which section is under the nav (style + active link) */
  useEffect(() => {
    const updateCover = () => {
      let sectionId: string | null = null;
      const y = COVER_OFFSET_PX;
      for (const id of COVER_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= y && rect.bottom >= y) {
          sectionId = id;
          break;
        }
      }
      setCurrentSectionId(sectionId);
      setCoverState(getCoverState(sectionId));
    };

    updateCover();
    window.addEventListener("scroll", updateCover, { passive: true });
    window.addEventListener("resize", updateCover);
    return () => {
      window.removeEventListener("scroll", updateCover);
      window.removeEventListener("resize", updateCover);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <nav
      id="main-nav"
      ref={navRef}
      className="nav-scroll-root fixed top-4 left-4 right-4 z-40 rounded-[32px] overflow-hidden shadow-lg border border-[var(--border-light)] backdrop-blur-md transition-colors duration-200"
      data-cover={coverState}
      data-nav-collapsed={isMobile && navCollapsed ? "true" : undefined}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Base layer (unfilled area): overridden by cover-state CSS */}
      <div
        className="nav-cover-bg absolute inset-0 bg-white/95 dark:bg-black/95"
        aria-hidden="true"
      />
      {/* Progress fill: overridden by cover-state CSS */}
      <div
        className="nav-progress-fill absolute inset-y-0 left-0 bg-[var(--primary)]"
        aria-hidden="true"
      />

      {/* Single full-width gradient wrapper so text aligns with blue fill */}
      <div className="nav-gradient-text w-full relative z-10">
        <div className="w-full px-4 sm:px-5">
          <div className="flex justify-between items-center h-16 md:h-20">
            <motion.a
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  handleNavClick("#hero");
                }
              }}
              className="text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-transparent rounded-lg inline-block nav-link nav-brand"
              data-active={currentSectionId === "hero" ? "true" : undefined}
              style={{ color: "inherit" }}
              aria-label="Anthony Silvia - Home"
              aria-current={currentSectionId === "hero" ? "page" : undefined}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              Anthony Silvia
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => {
                const isActive =
                  "internalPage" in item && item.internalPage
                    ? pathname === "/evidence"
                    : !item.external && item.href === `#${currentSectionId}`;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (!item.external && !("internalPage" in item && item.internalPage)) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                    }}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-lg px-2 py-1 inline-block nav-link nav-item-link"
                    data-active={isActive ? "true" : undefined}
                    style={{ color: "inherit" }}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    aria-label={item.external
                      ? `Open ${item.name} in new tab`
                      : ("internalPage" in item && item.internalPage)
                        ? `Go to ${item.name} page`
                        : `Go to ${item.name} section`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
              {onOpenAccessibility && (
                <motion.button
                  type="button"
                  onClick={onOpenAccessibility}
                  className="glass-circle-btn font-medium focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-full h-10 w-10 flex-shrink-0 inline-flex items-center justify-center bg-white/80 backdrop-blur-md text-[var(--primary)] shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2),inset_0_2px_0_rgba(255,255,255,0.9)] dark:bg-black/50 dark:backdrop-blur-md dark:shadow-[inset_0_-4px_14px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.08)]"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : navItems.length * 0.1 }}
                  aria-label="Open accessibility settings"
                >
                  <UniversalAccess className="h-5 w-5 fill-current" aria-hidden />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
