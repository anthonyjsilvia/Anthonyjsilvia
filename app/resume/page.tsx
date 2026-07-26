"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, ExternalLink, Globe, RefreshCw } from "lucide-react";
import FluentReveal from "@/components/FluentReveal";
import { useHeroGlowProps } from "@/components/HoverGlow";
import {
  ResumePublicProvider,
  usePublicResume,
} from "@/components/ResumePublicProvider";
import { normalizeExternalUrl } from "@/lib/resume-public";

const FALLBACK_PDF_PATH = "/resume.pdf";
const DOWNLOAD_PDF_PATH = "/api/resume/pdf?download=1";

/**
 * Resume page - Hero-matching cursor glow on actions and acrylic surfaces.
 */
export default function ResumePage() {
  return (
    <ResumePublicProvider>
      <ResumePageInner />
    </ResumePublicProvider>
  );
}

function GlowAction({
  className,
  accent,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"a"> & { accent?: boolean }) {
  const glow = useHeroGlowProps(accent ? "primary" : "secondary");
  return (
    <a
      {...rest}
      ref={glow.ref as React.Ref<HTMLAnchorElement>}
      className={[
        "resume-fluent__btn",
        "hover-glow",
        "hover-glow--control",
        accent ? "resume-fluent__btn--accent hover-glow--primary" : "hover-glow--secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerMove={(e) => {
        glow.onPointerMove(e);
        rest.onPointerMove?.(e);
      }}
    >
      <span aria-hidden="true" className="hover-glow__orb" />
      <span className="relative z-10 resume-fluent__btn-inner">{children}</span>
    </a>
  );
}

function GlowButton({
  className,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"button">) {
  const glow = useHeroGlowProps("secondary");
  return (
    <button
      {...rest}
      ref={glow.ref as React.Ref<HTMLButtonElement>}
      className={[
        "resume-fluent__btn",
        "hover-glow",
        "hover-glow--control",
        "hover-glow--secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerMove={(e) => {
        glow.onPointerMove(e);
        rest.onPointerMove?.(e);
      }}
    >
      <span aria-hidden="true" className="hover-glow__orb" />
      <span className="relative z-10 resume-fluent__btn-inner">{children}</span>
    </button>
  );
}

function ResumePageInner() {
  const shouldReduceMotion = useReducedMotion();
  const { status, data, error, refresh } = usePublicResume();

  const downloadPdfUrl =
    status === "ready" ? DOWNLOAD_PDF_PATH : FALLBACK_PDF_PATH;
  const pageUrl = data?.urls.page || null;
  const title = data?.title || "Anthony Silvia - Resume";
  const headline = data?.profile?.basics.headline?.trim() || null;
  const websiteUrl = normalizeExternalUrl(data?.profile?.basics.website);
  const linkedinUrl = normalizeExternalUrl(data?.profile?.basics.linkedinUrl);
  const updatedLabel = data?.updatedAt
    ? `Updated ${new Date(data.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}`
    : "Updated regularly";

  const fade = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay, ease: [0.33, 0, 0.1, 1] },
        };

  return (
    <div className="resume-fluent min-h-screen">
      <div className="resume-fluent__ambient" aria-hidden="true" />

      <div className="relative z-[1] w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-16 md:pb-24">
        <motion.header className="mb-8" {...fade(0)}>
          <p className="resume-fluent__eyebrow">Curriculum vitae</p>
          <h1 className="resume-fluent__title">Resume</h1>
          <p className="resume-fluent__lede">
            Work history, education, skills, and credentials - kept in sync with
            the live NodeDa Resume snapshot. Download a PDF when you need an
            offline copy.
          </p>
        </motion.header>

        <motion.div {...fade(0.06)} className="mb-5">
          <FluentReveal
            as="section"
            intensity="card"
            variant="secondary"
            className="resume-fluent__acrylic resume-fluent__command"
            aria-label="Resume actions"
          >
            <div className="resume-fluent__command-row">
              <div className="resume-fluent__command-copy">
                <h2 className="resume-fluent__command-title">{title}</h2>
                {headline ? (
                  <p className="resume-fluent__command-headline">{headline}</p>
                ) : null}
                <p className="resume-fluent__command-meta">
                  {status === "loading"
                    ? "Loading latest shared resume…"
                    : status === "error"
                      ? "Live resume unavailable"
                      : updatedLabel}
                </p>
              </div>

              <div className="resume-fluent__actions">
                <GlowAction
                  href={downloadPdfUrl}
                  download="Anthony-Silvia-Resume.pdf"
                  accent
                  aria-label="Download resume PDF"
                >
                  <Download className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
                  Download PDF
                </GlowAction>
                {pageUrl ? (
                  <GlowAction
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open hosted resume share page in a new tab"
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
                    Hosted page
                  </GlowAction>
                ) : null}
                {linkedinUrl ? (
                  <GlowAction
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open LinkedIn profile (opens in new tab)"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
                    LinkedIn
                  </GlowAction>
                ) : null}
                {websiteUrl ? (
                  <GlowAction
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit website (opens in new tab)"
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
                    Website
                  </GlowAction>
                ) : null}
                {status === "error" ? (
                  <GlowButton
                    type="button"
                    onClick={refresh}
                    aria-label="Retry loading live resume"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" strokeWidth={1.75} />
                    Retry
                  </GlowButton>
                ) : null}
              </div>
            </div>
          </FluentReveal>
        </motion.div>

        {status === "loading" ? (
          <div
            className="resume-fluent__acrylic resume-fluent__status"
            role="status"
            aria-live="polite"
          >
            <span className="resume-fluent__spinner" aria-hidden="true" />
            Loading resume…
          </div>
        ) : null}

        {status === "error" && error ? (
          <p className="resume-fluent__error" role="status">
            Live resume could not be loaded ({error}). You can still download
            the PDF fallback above.
          </p>
        ) : null}

        {status === "ready" && data?.html ? (
          <motion.div {...fade(0.12)}>
            <FluentReveal
              as="article"
              intensity="card"
              variant="secondary"
              className="resume-fluent__acrylic resume-fluent__document"
            >
              <div
                className="resume-embed"
                dangerouslySetInnerHTML={{ __html: data.html }}
              />
            </FluentReveal>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
