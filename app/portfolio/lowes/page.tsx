"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SiteBackBar from "@/components/SiteBackBar";
import { useMessages } from "@/lib/i18n/LocaleProvider";
import { lowesFigmaUrl } from "@/lib/lowes-case";
import { cineEase, dur } from "@/lib/motion";

/**
 * Independent retail case. The Figma file is one click away and is
 * password-protected. Copy states that the work is not a Lowe's deliverable.
 */
export default function LowesCasePage() {
  const shouldReduceMotion = useReducedMotion();
  const lowesCaseCopy = useMessages().lowes;

  return (
    <article className="min-h-screen bg-[var(--background)] pb-24 md:pb-32">
      <SiteBackBar href="/#portfolio" />
      <div className="h-[4.75rem]" aria-hidden="true" />

      <div className="mx-auto mt-6 w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] md:mt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : dur.xl,
              ease: cineEase,
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[var(--bg-secondary)]">
              <Image
                src={lowesCaseCopy.image}
                alt={lowesCaseCopy.imageAlt}
                fill
                className="object-cover"
                style={{ objectPosition: "88% 42%" }}
                sizes="(max-width: 1024px) 100vw, 48vw"
                quality={90}
                priority
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-tertiary)]">
              {lowesCaseCopy.imageCredit}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : dur.hero,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: cineEase,
            }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
              {lowesCaseCopy.eyebrow}
            </p>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-[var(--text-primary)]">
              {lowesCaseCopy.title}
            </h1>
            <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
              {lowesCaseCopy.kicker}
            </p>
            <div
              aria-hidden="true"
              className="mt-6 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
            />
            <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)]">
              {lowesCaseCopy.lead}
            </p>
            <div className="mt-6 space-y-4">
              {lowesCaseCopy.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[0.98rem] leading-[1.7] text-[var(--text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-[clamp(16px,2vw,24px)] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-5 md:p-6">
              <p className="text-sm font-semibold leading-relaxed text-[var(--text-primary)]">
                {lowesCaseCopy.accessNote}
              </p>
              <a
                href={lowesFigmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(var(--primary-rgb),0.55)] transition-transform duration-[var(--dur-apple-sm)] hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              >
                {lowesCaseCopy.continueLabel}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
