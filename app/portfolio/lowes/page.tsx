"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SiteBackBar from "@/components/SiteBackBar";
import ContactMeForm from "@/components/ContactMeForm";
import { lowesRequestCopy } from "@/lib/lowes-request";
import { cineEase, dur } from "@/lib/motion";

/**
 * Lowe's confidential case — request-gated like Request Resume.
 * Retail-associate-facing tech framing. No confidential UI shown.
 */
export default function LowesRequestPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <article className="min-h-screen bg-[var(--background)] pb-24 md:pb-32">
      <SiteBackBar href="/portfolio" label="Back to portfolio" />
      <div className="h-[4.75rem]" aria-hidden="true" />

      <div className="mx-auto mt-6 w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] md:mt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
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
                src={lowesRequestCopy.image}
                alt={lowesRequestCopy.imageAlt}
                fill
                className="object-cover"
                style={{ objectPosition: "88% 42%" }}
                sizes="(max-width: 1024px) 100vw, 48vw"
                quality={90}
                priority
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-tertiary)]">
              {lowesRequestCopy.imageCredit}
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
              {lowesRequestCopy.eyebrow}
            </p>
            <h1 className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-[var(--text-primary)]">
              {lowesRequestCopy.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
              Retail associate-facing tech · Lowe&apos;s
            </p>
            <div
              aria-hidden="true"
              className="mt-6 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
            />
            <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)]">
              {lowesRequestCopy.lede}
            </p>

            <div className="mt-10">
              <ContactMeForm
                fallbackEmail={lowesRequestCopy.fallbackEmail}
                heading={lowesRequestCopy.formHeading}
                description={lowesRequestCopy.formDescription}
                defaultSubject={lowesRequestCopy.defaultSubject}
                defaultCategory={lowesRequestCopy.defaultCategory}
                defaultBody={lowesRequestCopy.defaultBody}
                lockSubject
                hideCategory
                submitLabel={lowesRequestCopy.submitLabel}
                successTitle={lowesRequestCopy.successTitle}
                successMessage={lowesRequestCopy.successMessage}
                successActionLabel={lowesRequestCopy.successActionLabel}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}
