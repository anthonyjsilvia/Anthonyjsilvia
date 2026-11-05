"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, fadeUpBlur } from "@/lib/motion";
import { useMessages } from "@/lib/i18n/LocaleProvider";

/**
 * About page: portrait, the path from the stores into product design,
 * and the work Anthony runs on his own.
 */
export default function About() {
  const stageRef = useRef(null);
  const stageInView = useInView(stageRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();
  const reveal = fadeUpBlur(shouldReduceMotion);
  const sharpReveal = fadeUp(shouldReduceMotion, 28);
  const aboutContent = useMessages().about;

  return (
    <article
      id="about"
      aria-labelledby="about-heading"
      className="min-h-screen bg-[var(--background)] pb-24 pt-[4.75rem] md:pb-32"
    >
      <div className="hp-cine-stage !pt-10 md:!pt-14">
        <div ref={stageRef} className="hp-cine-stage__inner">
          <motion.div
            initial="hidden"
            animate={stageInView ? "visible" : "hidden"}
            variants={sharpReveal}
            className="hp-cine-stage__visual"
          >
            <Image
              src={aboutContent.image}
              alt={aboutContent.imageAlt}
              width={440}
              height={440}
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={stageInView ? "visible" : "hidden"}
            variants={reveal}
            className="hp-cine-stage__copy"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              {aboutContent.eyebrow}
            </p>
            <span
              className={`accent-rule mt-4 ${stageInView ? "accent-rule--animate" : ""}`}
              aria-hidden="true"
            />
            <h1
              id="about-heading"
              className="font-display mt-5 text-[clamp(2.1rem,4.5vw,3.5rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--text-primary)] max-w-[16ch]"
            >
              {aboutContent.title}
            </h1>
            <p className="mt-5 max-w-[36rem] text-[clamp(1.05rem,1.5vw,1.2rem)] font-medium leading-[1.55] text-[var(--text-secondary)]">
              {aboutContent.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={aboutContent.primaryCta.href}
                className="btn-apple-lift inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(var(--primary-rgb),0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              >
                {aboutContent.primaryCta.label}
              </Link>
              <Link
                href={aboutContent.secondaryCta.href}
                className="btn-apple-lift inline-flex items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--background)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              >
                {aboutContent.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </div>

        <dl className="mx-auto mt-14 grid w-full max-w-[var(--hp-cine-max)] gap-px overflow-hidden rounded-[clamp(16px,2vw,24px)] border border-[var(--border-light)] bg-[var(--border-light)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {aboutContent.facts.map((fact) => (
            <div key={fact.label} className="bg-[var(--background)] px-5 py-5">
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-snug text-[var(--text-primary)]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)]">
        {aboutContent.sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`about-${section.id}`}
            className="border-t border-[var(--border-light)] py-12 md:py-16"
          >
            <h2
              id={`about-${section.id}`}
              className="font-display max-w-[16ch] text-[clamp(1.7rem,3vw,2.35rem)] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]"
            >
              {section.title}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[1.02rem] leading-[1.75] text-[var(--text-secondary)] md:text-[1.08rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
