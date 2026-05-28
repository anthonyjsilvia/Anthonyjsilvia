"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";

const RESUME_PDF_PATH = "/resume.pdf";

/**
 * Resume page: short intro, two primary actions (download + open in new tab),
 * and the resume PDF embedded inline so visitors can preview without leaving.
 *
 * `Tilt3D` keeps the chunky 3D feel of the rest of the site by lifting the
 * action card off the page on hover.
 */
export default function ResumePage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
      {/* Top padding clears the fixed nav pill (top-4 + h-16/h-20 ≈ 80-96px). */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 pt-28 md:pt-32 pb-16 md:pb-24">
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
            Resume
          </h1>
          <div className="w-24 h-1 bg-[var(--primary)] rounded-full mb-6" />
          <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-3xl">
            A full overview of my work history, education, and credentials. Preview
            below or download the PDF for offline review and submission.
          </p>
        </motion.header>

        {/* Action card: lifted in 3D so it matches the rest of the site. */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="mb-10"
        >
          <Tilt3D
            max={6}
            lift={16}
            scale={1.01}
            glare
            roundedClassName="rounded-2xl"
            className="card-3d bg-white dark:bg-black p-6 md:p-8 rounded-2xl border border-[var(--border-light)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-1">
                  Anthony Silvia — Resume
                </h2>
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                  PDF, updated regularly. Embedded preview below.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={RESUME_PDF_PATH}
                  download="Anthony-Silvia-Resume.pdf"
                  className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                  aria-label="Download resume PDF"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download
                </a>
                <a
                  href={RESUME_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-3d-light inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-black text-[var(--text-primary)] dark:text-[var(--text-primary)] font-medium border border-[var(--border-light)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                  aria-label="Open resume PDF in a new tab"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Open in new tab
                </a>
              </div>
            </div>
          </Tilt3D>
        </motion.div>

        {/* Embedded PDF preview.
            <object> with an <iframe>/<a> fallback chain gives the broadest
            cross-browser support: macOS Safari and Chrome render PDFs inline
            via <object>, mobile Safari falls back to the iframe (which
            triggers the system PDF viewer), and any browser that refuses both
            shows the download link. */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.18 }}
          className="rounded-2xl overflow-hidden border border-[var(--border-light)] bg-white dark:bg-black shadow-md"
        >
          <object
            data={RESUME_PDF_PATH}
            type="application/pdf"
            className="block w-full h-[80vh] min-h-[600px]"
            aria-label="Resume PDF preview"
          >
            <iframe
              src={RESUME_PDF_PATH}
              title="Resume PDF preview"
              className="block w-full h-[80vh] min-h-[600px] border-0"
            >
              <p className="p-6 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                Your browser can&apos;t display the resume inline.{" "}
                <a
                  href={RESUME_PDF_PATH}
                  className="text-[var(--primary)] underline"
                  download="Anthony-Silvia-Resume.pdf"
                >
                  Download the PDF instead
                </a>
                .
              </p>
            </iframe>
          </object>
        </motion.div>
      </div>
    </div>
  );
}
