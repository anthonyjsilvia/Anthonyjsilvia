"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Mobile/desktop scroll affordance: a “back to top” FAB that appears while
 * scrolling (and hides after idle). The old bottom-sheet menu was removed —
 * site navigation now lives in the top Menu / Search cluster.
 */
const liquidSpring = { type: "spring" as const, stiffness: 200, damping: 22 };
const liquidSpringReduced = { type: "spring" as const, stiffness: 320, damping: 28 };

export default function FabNav() {
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

  const springConfig = shouldReduceMotion ? liquidSpringReduced : liquidSpring;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {showFab && (
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
  );
}
