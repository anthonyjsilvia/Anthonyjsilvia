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

/**
 * Recommendations — clean editorial social proof:
 * full-height square portraits fading into quote copy.
 */
export default function Recommendations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <section
      id="recommendations"
      ref={ref}
      className="recs scroll-mt-24 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]"
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
          <h2 id="recommendations-heading" className="recs__title">
            Kind words from people I&rsquo;ve worked with.
          </h2>
          <p className="recs__lede">
            Leaders and peers who saw the work up close. Each note opens to the
            full recommendation.
          </p>
        </motion.header>

        <motion.ul
          role="list"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="recs__list"
        >
          {recommendations.map((rec) => (
            <motion.li key={rec.slug} variants={itemVariants} className="recs__item">
              <RecommendationRow rec={rec} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
