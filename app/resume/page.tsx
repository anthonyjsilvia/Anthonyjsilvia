"use client";

import { motion, useReducedMotion } from "framer-motion";
import ContactMeForm from "@/components/ContactMeForm";
import { resumeRequestCopy } from "@/lib/resume-request";

/**
 * Request Resume — no public document or PDF.
 * Full CV is shared privately after a request.
 */
export default function RequestResumePage() {
  const shouldReduceMotion = useReducedMotion();
  const fade = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay, ease: [0.33, 0, 0.1, 1] },
        };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="relative z-[1] w-full max-w-2xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-16 md:pb-24">
        <motion.header {...fade(0)}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            {resumeRequestCopy.eyebrow}
          </p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-[-0.035em] leading-[1.1] text-[var(--text-primary)]">
            {resumeRequestCopy.title}
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
            {resumeRequestCopy.lede}
          </p>
        </motion.header>

        <motion.div className="mt-10" {...fade(0.08)}>
          <ContactMeForm
            fallbackEmail={resumeRequestCopy.fallbackEmail}
            heading={resumeRequestCopy.formHeading}
            description={resumeRequestCopy.formDescription}
            defaultSubject={resumeRequestCopy.defaultSubject}
            defaultCategory={resumeRequestCopy.defaultCategory}
            defaultBody={resumeRequestCopy.defaultBody}
            lockSubject
            hideCategory
            submitLabel={resumeRequestCopy.submitLabel}
            successTitle={resumeRequestCopy.successTitle}
            successMessage={resumeRequestCopy.successMessage}
            successActionLabel={resumeRequestCopy.successActionLabel}
          />
        </motion.div>
      </div>
    </div>
  );
}
