"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, X } from "lucide-react";
import SiteBackBar from "@/components/SiteBackBar";
import {
  herbswiftGallery,
  herbswiftMeta,
  herbswiftPdfs,
  type HerbswiftGalleryItem,
} from "@/lib/herbswift";
import { cineEase, dur } from "@/lib/motion";

function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: HerbswiftGalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Close gallery viewer"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
      <figure
        className="relative flex max-h-full max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={1200}
          height={1600}
          className="max-h-[78vh] w-auto object-contain"
          sizes="(max-width: 1024px) 100vw, 960px"
          priority
        />
        <figcaption id={titleId} className="text-center text-sm text-white/80">
          {item.caption}
        </figcaption>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Next
          </button>
        </div>
      </figure>
    </motion.div>
  );
}

export default function HerbswiftGalleryPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const open = useCallback((i: number) => setActiveIndex(i), []);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i == null ? null : (i + herbswiftGallery.length - 1) % herbswiftGallery.length,
    );
  }, []);
  const next = useCallback(() => {
    setActiveIndex((i) =>
      i == null ? null : (i + 1) % herbswiftGallery.length,
    );
  }, []);

  const active = activeIndex != null ? herbswiftGallery[activeIndex] : null;

  return (
    <article className="min-h-screen bg-[var(--background)] pb-24 md:pb-32">
      <SiteBackBar href="/portfolio" label="Back to portfolio" />
      <div className="h-[4.75rem]" aria-hidden="true" />

      <div className="mx-auto mt-6 w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] md:mt-10">
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : dur.xl,
            ease: cineEase,
          }}
          className="mb-12 max-w-3xl md:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Case · {herbswiftMeta.period}
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]">
            {herbswiftMeta.title}
          </h1>
          <p className="mt-3 text-sm font-semibold text-[var(--text-secondary)]">
            {herbswiftMeta.role}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {herbswiftMeta.status}
          </p>
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[#38B548] to-transparent"
          />
          <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.15rem]">
            {herbswiftMeta.summary}
          </p>
        </motion.header>

        <section
          aria-labelledby="herbswift-story"
          className="mb-16 grid gap-8 border-t border-[var(--border-light)] pt-12 md:mb-20 md:grid-cols-3 md:gap-10"
        >
          <h2 id="herbswift-story" className="sr-only">
            Problem, approach, outcome
          </h2>
          {(
            [
              ["Problem", herbswiftMeta.problem],
              ["Approach", herbswiftMeta.approach],
              ["Outcome", herbswiftMeta.outcome],
            ] as const
          ).map(([label, body]) => (
            <div key={label}>
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                {label}
              </h3>
              <p className="mt-3 text-[0.98rem] leading-[1.65] text-[var(--text-secondary)]">
                {body}
              </p>
            </div>
          ))}
        </section>

        <section aria-labelledby="herbswift-gallery-heading" className="mb-16 md:mb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="herbswift-gallery-heading"
                className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]"
              >
                Gallery
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
                Polished product overview plus curated frames from iPhone, iPad,
                and web builds. Click any frame to view full-size.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] underline-offset-4 hover:underline"
            >
              All portfolio
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {herbswiftGallery.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => open(index)}
                  className="group relative block w-full overflow-hidden rounded-xl bg-[var(--bg-secondary)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                  aria-label={`View ${item.caption}`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e8e8e8] dark:bg-[var(--bg-secondary)]">
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className={
                        item.surface === "Marketing"
                          ? "object-cover object-center transition-transform duration-[var(--dur-apple-md)] group-hover:scale-[1.03]"
                          : "object-contain object-center p-2 transition-transform duration-[var(--dur-apple-md)] group-hover:scale-[1.02]"
                      }
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <span className="flex items-center justify-between gap-2 px-3 py-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                      {item.surface}
                    </span>
                    <span className="truncate text-sm font-medium text-[var(--text-secondary)]">
                      {item.caption}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="herbswift-sources"
          className="border-t border-[var(--border-light)] pt-12"
        >
          <h2
            id="herbswift-sources"
            className="font-display text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)]"
          >
            Source documents
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            Original 2018 build PDFs for reference. The gallery above is the
            primary way to review the work.
          </p>
          <ul role="list" className="mt-6 flex flex-wrap gap-2">
            {herbswiftPdfs.map((pdf) => (
              <li key={pdf.path}>
                <a
                  href={pdf.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {pdf.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AnimatePresence>
        {active ? (
          <Lightbox
            item={active}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        ) : null}
      </AnimatePresence>
    </article>
  );
}
