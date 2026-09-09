/**
 * Shared Framer Motion presets — Apple HIG–aligned tempo.
 * Motion is purposeful and brief; every consumer must honor reduced motion.
 * Judgment (web): map Apple ease-out / spring to cubic-bezier tokens already
 * defined as --ease-apple-* in globals.css.
 */

export const appleEaseOut = [0.16, 1, 0.3, 1] as const;
export const appleEaseSmooth = [0.32, 0.72, 0, 1] as const;
export const appleEaseInOut = [0.65, 0, 0.35, 1] as const;
/** Soft overshoot for press/hover feedback only — not for page reveals. */
export const appleSpring = [0.34, 1.56, 0.64, 1] as const;

export const cineEase = [0.22, 1, 0.36, 1] as const;

/** Durations in seconds (Framer Motion). */
export const dur = {
  xs: 0.16,
  sm: 0.24,
  md: 0.36,
  lg: 0.52,
  xl: 0.8,
  hero: 1.0,
} as const;

export function fadeUp(reduced: boolean | null, y = 28) {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : dur.xl,
        ease: cineEase,
      },
    },
  };
}

export function fadeUpBlur(reduced: boolean | null, y = 32) {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : y,
      filter: reduced ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduced ? 0 : dur.hero,
        ease: cineEase,
      },
    },
  };
}

export function staggerContainer(reduced: boolean | null, stagger = 0.08, delay = 0.06) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  };
}

/** Hero copy stack — signature orchestrated entrance. */
export function heroStagger(reduced: boolean | null) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.1,
        delayChildren: reduced ? 0 : 0.12,
      },
    },
  };
}

export function heroItem(reduced: boolean | null) {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 36,
      filter: reduced ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduced ? 0 : 0.9,
        ease: cineEase,
      },
    },
  };
}
