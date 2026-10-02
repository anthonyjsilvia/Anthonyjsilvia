"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  recommendations,
  type Recommendation,
} from "@/lib/recommendations";
import { cineEase, dur, fadeUpBlur, staggerContainer } from "@/lib/motion";

/** First paragraph, trimmed for a scannable pull quote on the grid. */
function pullQuote(testimonial: string, max = 160): string {
  const first = (testimonial.split("\n\n")[0] ?? testimonial).trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Recommendation card: full-bleed square portrait on the left, soft fade
 * into copy on the right. Entire surface is the link.
 */
function RecommendationRow({ rec }: { rec: Recommendation }) {
  const href = `/recommendations/${rec.slug}`;
  const quote = pullQuote(rec.testimonial);

  return (
    <Link
      href={href}
      className="recs-row group"
      aria-label={`Read full recommendation from ${rec.name}, ${rec.role}`}
    >
      <span className="recs-row__media" aria-hidden="true">
        <Image
          src={rec.image}
          alt=""
          width={280}
          height={280}
          className="recs-row__photo"
          sizes="(min-width: 900px) 180px, 140px"
        />
      </span>

      <span className="recs-row__body">
        <span className="recs-row__copy">
          <span className="recs-row__identity">
            <span className="recs-row__name">{rec.name}</span>
            <span className="recs-row__role">{rec.role}</span>
          </span>
          <blockquote className="recs-row__quote">
            <span className="recs-row__quote-mark" aria-hidden="true">
              “
            </span>
            {quote}
          </blockquote>
        </span>
        <span className="recs-row__cta">
          Read full recommendation
          <ArrowUpRight className="recs-row__cta-icon" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

type RecommendationsProps = {
  /** Cap how many cards show on the full page. Omit to show all. */
  limit?: number;
  /** Use h1 + page spacing (dedicated /recommendations route). */
  asPage?: boolean;
};

/**
 * Recommendations, clean editorial social proof.
 *
 * Homepage: portraits only + CTA button into the full list.
 * /recommendations: full quote rows.
 */
export default function Recommendations({
  limit,
  asPage = false,
}: RecommendationsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const list =
    typeof limit === "number"
      ? recommendations.slice(0, limit)
      : recommendations;

  const containerVariants = staggerContainer(shouldReduceMotion, 0.07, 0.08);
  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : dur.xl,
        ease: cineEase,
      },
    },
  };
  const titleReveal = fadeUpBlur(shouldReduceMotion);
  const Heading = asPage ? "h1" : "h2";

  return (
    <section
      id="recommendations"
      ref={ref}
      className={`recs scroll-mt-24 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]${asPage ? " recs--page" : ""}`}
      aria-labelledby="recommendations-heading"
    >
      <div className="recs__inner">
        <motion.header
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleReveal}
          className="recs__header"
        >
          <p className="recs__eyebrow">Recommendations</p>
          <span
            className={`accent-rule mt-4 ${isInView ? "accent-rule--animate" : ""}`}
            aria-hidden="true"
          />
          <Heading id="recommendations-heading" className="recs__title">
            Kind words from people I&rsquo;ve worked with.
          </Heading>
          {asPage ? (
            <p className="recs__lede">
              Managers and peers who saw the work up close. Open any note for
              the full recommendation.
            </p>
          ) : null}
        </motion.header>

        {asPage ? (
          <motion.ul
            role="list"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="recs__list"
          >
            {list.map((rec) => (
              <motion.li
                key={rec.slug}
                variants={itemVariants}
                className="recs__item"
              >
                <RecommendationRow rec={rec} />
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <>
            <motion.ul
              role="list"
              aria-label="People who recommended Anthony"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="recs__faces"
            >
              {recommendations.map((rec) => (
                <motion.li
                  key={rec.slug}
                  variants={itemVariants}
                  className="recs__face"
                >
                  <Link
                    href={`/recommendations/${rec.slug}`}
                    className="recs__face-link group"
                    aria-label={`Read recommendation from ${rec.name}`}
                  >
                    <Image
                      src={rec.image}
                      alt=""
                      width={480}
                      height={480}
                      className="recs__face-photo"
                      sizes="(max-width: 719px) 45vw, (max-width: 1480px) 22vw, 340px"
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : dur.md,
                delay: shouldReduceMotion ? 0 : 0.2,
                ease: cineEase,
              }}
              className="mt-10"
            >
              <Link
                href="/recommendations"
                className="recs__all-btn group inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(var(--primary-rgb),0.55)] transition-transform duration-[var(--dur-apple-sm)] hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              >
                All recommendations
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-[var(--dur-apple-sm)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
