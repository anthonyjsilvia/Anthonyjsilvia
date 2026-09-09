"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Award, Command, Linkedin, Mail } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import GlowLink from "@/components/GlowLink";
import { cineEase, dur } from "@/lib/motion";

/**
 * Footer - the site's wayfinding-and-handshake bar at the bottom of every
 * page.
 *
 * Three horizontal bands:
 *   1. Closing CTA   - a single oversized question that invites the visitor
 *                      to keep the conversation going, plus the primary
 *                      "Get in touch" button and a quick-copy email.
 *   2. Sitemap grid  - brand block on the left, internal page links + social
 *                      / credential links on the right, in the muted utility
 *                      style portfolios usually use down here.
 *   3. Bottom bar    - copyright, NodeDa credits, and a ⌘K terminal hint.
 */

const CONTACT = {
  email: "contact@anthonysilvia.com",
  linkedin: "https://linkedin.com/in/anthonyjsilvia",
  credly: "https://www.credly.com/users/anthony-silvia",
} as const;

const NODEDA = {
  home: "https://nodeda.com",
  work: "https://work.nodeda.com",
  logoLight: "https://nodeda.com/logos/NodeDa.svg",
  logoDark: "https://nodeda.com/logos/NodeDa.darkmode.svg",
  workLogoLight: "https://nodeda.com/logos/NodeDa.work.svg",
  workLogoDark: "https://nodeda.com/logos/NodeDa.work.darkmode.svg",
} as const;

const PAGE_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/evidence", label: "Evidence" },
  { href: "/#ai", label: "AI practice" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

type SocialLink = {
  href: string;
  label: string;
  handle: string;
  Icon: typeof Mail;
  external: boolean;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: `mailto:${CONTACT.email}`,
    label: "Email",
    handle: CONTACT.email,
    Icon: Mail,
    external: false,
  },
  {
    href: CONTACT.linkedin,
    label: "LinkedIn",
    handle: "anthonyjsilvia",
    Icon: Linkedin,
    external: true,
  },
  {
    href: CONTACT.credly,
    label: "Credly",
    handle: "anthony-silvia",
    Icon: Award,
    external: true,
  },
];

export default function Footer() {
  // Copyright year is computed on the client after mount so the static HTML
  // ships with a sensible default and the dynamic value takes over once
  // hydrated. Avoids hydration mismatches if SSR is generated in a different
  // year than the client viewing it (e.g. a stale CDN cache around a year
  // boundary).
  const [year, setYear] = useState<number>(2026);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-15%" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      role="contentinfo"
      aria-labelledby="footer-cta-heading"
      className="relative border-t border-[var(--border-light)] bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
    >
      {/* Top accent - a 1px gradient hairline at the very top of the footer
          that hints at the brand color without competing with content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ───────── Closing CTA ───────── */}
        <section
          ref={ctaRef}
          className="grid gap-10 py-16 md:grid-cols-[1.4fr_1fr] md:items-center md:py-24 md:gap-12 border-b border-[var(--border-light)]"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 28,
            }}
            animate={
              ctaInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 28 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : dur.xl,
              ease: cineEase,
            }}
          >
            <h2
              id="footer-cta-heading"
              className="text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text-primary)] dark:text-[var(--text-primary)] md:text-5xl lg:text-6xl"
            >
              Have a problem
              <br />
              <span className="text-[var(--primary)]">worth solving?</span>
            </h2>
            <span
              className={`accent-rule mt-6 ${ctaInView ? "accent-rule--animate" : ""}`}
              aria-hidden="true"
            />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary)] md:text-lg">
              Open to Product Experience Manager roles where AI is a real
              advantage - discovery through delivery in enterprise ops,
              accessibility-first systems, and research-led decisions that
              move business outcomes at higher throughput.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 20,
            }}
            animate={
              ctaInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : dur.lg,
              delay: shouldReduceMotion ? 0 : 0.12,
              ease: cineEase,
            }}
            className="flex flex-col items-start gap-3 md:items-end"
          >
            <GlowLink
              href="/contact"
              variant="primary"
              aria-label="Open Contact page"
              className="group btn-apple-lift rounded-full bg-[var(--primary)] px-6 py-3.5 text-base font-semibold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Get in touch</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </GlowLink>
            <a
              href={`mailto:${CONTACT.email}`}
              aria-label={`Email ${CONTACT.email}`}
              className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--text-primary)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              <span>{CONTACT.email}</span>
            </a>
          </motion.div>
        </section>

        {/* ───────── Sitemap grid ───────── */}
        <section
          aria-label="Site navigation and contact"
          className="grid gap-10 py-12 md:grid-cols-12 md:py-16 md:gap-12"
        >
          {/* Brand block */}
          <div className="md:col-span-6 lg:col-span-5">
            <Link
              href="/"
              aria-label="Anthony Silvia - Home"
              className="inline-flex items-baseline rounded-md text-xl font-semibold tracking-tight text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              Anthony Silvia
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
              Product Experience Manager - hybrid of product management and UX,
              AI-accelerated for higher efficiency and output. Currently a
              Product Designer at{" "}
              <span className="font-medium text-[var(--text-primary)]">
                Lowe&apos;s
              </span>{" "}
              on enterprise retail ops, and Principal Consultant at NodeDa.
              Based in Charlotte, North Carolina.
            </p>

            <p
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
              aria-label="Currently shipping product experience at Lowe's"
            >
              <span
                aria-hidden="true"
                className="relative inline-flex h-2 w-2"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
              </span>
              Currently shipping product experience at Lowe&apos;s
            </p>
          </div>

          {/* Pages */}
          <nav
            aria-label="Footer page links"
            className="md:col-span-3 lg:col-span-3"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              Pages
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block rounded text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <nav
            aria-label="Contact and social links"
            className="md:col-span-3 lg:col-span-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
              Connect
            </h3>
            <ul role="list" className="mt-4 space-y-3">
              {SOCIAL_LINKS.map(({ href, label, handle, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={
                      external
                        ? `${label} - ${handle} (opens in new tab)`
                        : `${label} - ${handle}`
                    }
                    className="group inline-flex items-center gap-2.5 rounded text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                  >
                    <Icon
                      className="h-4 w-4 flex-shrink-0 text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--primary)]"
                      aria-hidden="true"
                    />
                    <span className="font-medium">{label}</span>
                    <span className="text-[var(--text-tertiary)]">{handle}</span>
                    {external && (
                      <ArrowUpRight
                        className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* ───────── Bottom bar ───────── */}
        <div className="flex flex-col gap-5 border-t border-[var(--border-light)] py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            <a
              href={NODEDA.home}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hosted using NodeDa (opens in new tab)"
              className="inline-flex items-center gap-2 rounded-md text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              <span>Hosted using</span>
              <img
                src={NODEDA.logoLight}
                alt=""
                className="h-4 w-auto object-contain dark:hidden"
              />
              <img
                src={NODEDA.logoDark}
                alt=""
                className="hidden h-4 w-auto object-contain dark:block"
              />
            </a>
            <a
              href={NODEDA.work}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Powered by NodeDa Work (opens in new tab)"
              className="inline-flex items-center gap-2 rounded-md text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              <span>Powered by</span>
              <img
                src={NODEDA.workLogoLight}
                alt=""
                className="h-4 w-auto object-contain dark:hidden"
              />
              <img
                src={NODEDA.workLogoDark}
                alt=""
                className="hidden h-4 w-auto object-contain dark:block"
              />
            </a>
          </div>

          <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-xs text-[var(--text-tertiary)]">
              © {year} Anthony Silvia. All rights reserved.
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
              <span>Try the terminal  - </span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-[var(--border-light)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--text-secondary)] shadow-sm">
                <Command className="h-2.5 w-2.5" aria-hidden="true" />
                <span>K</span>
              </kbd>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
