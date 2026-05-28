"use client";

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { recommendations, type Recommendation } from "@/lib/recommendations";

/**
 * AppleTVCard
 *
 * Three-layer parallax modeled on the tvOS "focus" card effect.
 *
 * Layers (back → front, each parallaxing at a different magnitude):
 *   1. Background  — full original photo, lightly blurred + dimmed.
 *                    Moves SUBTLY opposite to the cursor (slow, distant).
 *   2. Midground   — cream stage that fades in on hover behind the
 *                    cut-out subject and hides any imperfect mask edges.
 *   3. Subject     — background-removed PNG of the person. Parallaxes
 *                    STRONGLY WITH the cursor (i.e. moves toward the
 *                    cursor while background moves away), so when you
 *                    tilt the card the person lifts away from the
 *                    background — the classic Apple TV pop.
 *
 *  Plus: card tilt, edge vignette, cursor-tracked specular sheen, label
 *  floating at the top of the Z-stack.
 *
 * Now renders as a `<motion(Link)>` rather than a button — clicking a
 * card navigates to `/recommendations/<slug>` rather than opening a
 * modal. This keeps the URL shareable and removes a whole category of
 * focus / scroll-lock / stacking-context bugs.
 *
 * Accessibility:
 *  - Honors prefers-reduced-motion and falls back to a static link card.
 *  - Gracefully degrades to single-image if no `subject` PNG is provided.
 *  - The subject PNG is purely decorative; the original image still
 *    handles meaning for assistive tech via the card's aria-label.
 */
const MotionLink = motion(Link);

function AppleTVCard({ rec }: { rec: Recommendation }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasSubject = Boolean(rec.subject);
  const href = `/recommendations/${rec.slug}`;
  const ariaLabel = `Read recommendation from ${rec.name}, ${rec.role}`;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hover = useMotionValue(0);

  const cardSpring = { stiffness: 260, damping: 26, mass: 0.5 };
  const subjectSpring = { stiffness: 220, damping: 22, mass: 0.5 };
  const sx = useSpring(px, cardSpring);
  const sy = useSpring(py, cardSpring);
  /* Subject moves with its own spring so it feels physically lighter than the card */
  const sxSubj = useSpring(px, subjectSpring);
  const sySubj = useSpring(py, subjectSpring);
  const sh = useSpring(hover, { stiffness: 220, damping: 28, mass: 0.4 });

  /* Card 3D tilt */
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const cardZ = useTransform(sh, [0, 1], [0, 30]);
  const cardScale = useTransform(sh, [0, 1], [1, 1.04]);

  /* Photo fades out on hover, cream backdrop fades in. */
  const photoOpacity = useTransform(sh, [0, 1], [1, 0]);
  const creamOpacity = useTransform(sh, [0, 1], [0, 1]);

  /* Subject — strong parallax, WITH cursor (lifts off the cream backdrop) */
  const subjX = useTransform(sxSubj, [-0.5, 0.5], [-22, 22]);
  const subjY = useTransform(sySubj, [-0.5, 0.5], [-22, 22]);
  const subjScale = useTransform(sh, [0, 1], [1.0, 1.1]);

  /* Label — pops further forward and tracks cursor lightly */
  const overlayX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const overlayY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  /* Specular highlight — follows the cursor */
  const sheenOpacity = useTransform(sh, [0, 1], [0, 0.42]);
  const sheenBg = useTransform([sx, sy] as never, ([x, y]: number[]) => {
    const cx = (x + 0.5) * 100;
    const cy = (y + 0.5) * 100;
    return `radial-gradient(60% 55% at ${cx}% ${cy}%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%)`;
  });

  /* Edge vignette deepens on focus */
  const vignetteOpacity = useTransform(sh, [0, 1], [0, 0.45]);

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(nx);
    py.set(ny);
  };
  const handleEnter = () => {
    if (shouldReduceMotion) return;
    hover.set(1);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };
  const handleFocus = () => {
    if (shouldReduceMotion) return;
    hover.set(1);
  };
  const handleBlur = () => {
    px.set(0);
    py.set(0);
    hover.set(0);
  };

  if (shouldReduceMotion) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className="group relative block w-full aspect-square rounded-2xl overflow-hidden border border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      >
        <Image
          src={rec.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-left flex items-end justify-between gap-2">
          <div>
            <p className="text-white font-semibold text-sm">{rec.name}</p>
            <p className="text-white/90 text-xs">{rec.role}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white flex-shrink-0" aria-hidden />
        </div>
      </Link>
    );
  }

  return (
    <div
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
      className="rounded-2xl"
    >
      <MotionLink
        ref={ref}
        href={href}
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="apple-tv-card relative block w-full aspect-square rounded-2xl border border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 bg-[#f7eedb] dark:bg-[#1e1a14]"
        style={{
          rotateX,
          rotateY,
          z: cardZ,
          scale: cardScale,
          transformStyle: "preserve-3d",
          clipPath: "inset(0 round 1rem)",
          WebkitClipPath: "inset(0 round 1rem)",
        }}
        aria-label={ariaLabel}
      >
        {/* Layer 1 — Cream stage backdrop. Always rendered; fades IN on hover. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[#f7eedb] dark:bg-[#1e1a14]"
          style={{ opacity: creamOpacity }}
        />

        {/* Layer 2 — Original photo. Visible at rest, fades OUT on hover. */}
        <motion.div className="absolute inset-0" style={{ opacity: photoOpacity }}>
          <Image
            src={rec.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
            draggable={false}
          />
        </motion.div>

        {/* Layer 3 — Subject (cut-out person) with strong parallax. */}
        {hasSubject && (
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{
              x: subjX,
              y: subjY,
              scale: subjScale,
              z: 24,
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={rec.subject!}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
              draggable={false}
            />
          </motion.div>
        )}

        {/* Soft warm vignette on hover — frames the subject. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              "radial-gradient(120% 100% at 50% 45%, transparent 50%, rgba(60,40,20,0.28) 100%)",
          }}
        />

        {/* Specular sheen — follows cursor, sits above the subject. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: sheenBg,
            opacity: sheenOpacity,
            mixBlendMode: "overlay",
            z: 34,
          }}
        />

        {/* Bottom gradient + label */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-3 text-left flex items-end justify-between gap-2 opacity-100 md:opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            x: overlayX,
            y: overlayY,
            z: 42,
          }}
        >
          <div>
            <p className="text-white font-semibold text-sm">{rec.name}</p>
            <p className="text-white/90 text-xs">{rec.role}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white flex-shrink-0" aria-hidden />
        </motion.div>
      </MotionLink>
    </div>
  );
}

/**
 * Recommendations section — card grid only.
 *
 * Each card is a link to `/recommendations/<slug>`. The previous in-page
 * modal implementation has been retired in favor of dedicated detail
 * pages: individual URLs are shareable, there's no focus/scroll-lock
 * juggling, and the route benefits from Next's automatic prefetching.
 */
export default function Recommendations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
      },
    },
  };

  return (
    <section
      id="recommendations"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-black scroll-mt-24"
      aria-labelledby="recommendations-heading"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="recommendations-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Recommendations
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
          <p className="mt-6 text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-2xl mx-auto">
            Kind words from colleagues and managers I&rsquo;ve worked with.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full"
        >
          {recommendations.map((rec) => (
            <motion.div key={rec.slug} variants={itemVariants}>
              <AppleTVCard rec={rec} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
