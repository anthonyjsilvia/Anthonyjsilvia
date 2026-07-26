"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Globe, ArrowUpRight } from "lucide-react";
import ContactMeForm from "./ContactMeForm";
import GlowLink from "@/components/GlowLink";

const NODEDA_LOGO_LIGHT = "https://nodeda.com/logos/NodeDa.black.svg";
const NODEDA_LOGO_DARK = "https://nodeda.com/logos/NodeDa.white.svg";

// Contact information
const contactInfo = {
  email: "contact@anthonysilvia.com",
  linkedin: "linkedin.com/in/anthonyjsilvia",
  personal: "anthonysilvia.com",
};

const NODEDA_REQUEST_SERVICE_URL = "https://nodeda.com/contact/request-service";
const NODEDA_HOMEPAGE_URL = "https://nodeda.com";

const links = [
  {
    key: "email",
    href: `mailto:${contactInfo.email}`,
    label: "Email",
    value: contactInfo.email,
    description: "Drop a line. I usually reply within a day",
    icon: Mail,
    iconType: "lucide" as const,
    external: false,
    ariaLabel: `Send email to ${contactInfo.email}`,
  },
  {
    key: "linkedin",
    href: `https://${contactInfo.linkedin}`,
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    description: "Professional profile and experience",
    icon: Linkedin,
    iconType: "lucide" as const,
    external: true,
    ariaLabel: "Visit LinkedIn profile (opens in new tab)",
  },
  {
    key: "personal",
    href: `https://${contactInfo.personal}`,
    label: "Website",
    value: contactInfo.personal,
    description: "More about me and my work",
    icon: Globe,
    iconType: "lucide" as const,
    external: true,
    ariaLabel: "Visit personal website (opens in new tab)",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Soft gradient background for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--background)] to-[var(--bg-secondary)] dark:from-[var(--bg-secondary)] dark:via-[var(--background)] dark:to-[var(--bg-secondary)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,var(--primary)_0%,transparent_50%)] opacity-[0.06] dark:opacity-[0.08]" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--primary)] dark:text-[var(--primary)] mb-3">
            Connect
          </p>
          <h2
            id="contact-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4"
          >
            Let&apos;s work together
          </h2>
          <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-xl mx-auto">
            Reach out for projects, collaboration, or just to say hello.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: 0.05 }}
          className="mb-10 md:mb-12"
        >
          <ContactMeForm fallbackEmail={contactInfo.email} />
        </motion.div>

        {/* Link grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-4 sm:grid-cols-2"
        >
          {links.map((item) => {
            const Icon = item.icon;
            const isWebsite = item.key === "personal";
            const displayValue = isWebsite ? item.value.replace(/\.cloud$/i, "") : item.value;

            /* Website card: use div + click handler to avoid <a> inside <a> (hydration error) */
            if (isWebsite) {
              return (
                <motion.div
                  key={item.key}
                  role="link"
                  tabIndex={0}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('a[href*="request-service"]')) return;
                    if ((e.target as HTMLElement).closest("[data-nodeda-overlay]")) return;
                    window.open(item.href, "_blank", "noopener,noreferrer");
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    if ((e.target as HTMLElement).closest('a[href*="request-service"]')) return;
                    e.preventDefault();
                    window.open(item.href, "_blank", "noopener,noreferrer");
                  }}
                  variants={itemVariants}
                  aria-label={item.ariaLabel}
                  className="group relative flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-[var(--background)] dark:bg-[var(--background)] border border-[var(--border-light)] shadow-sm hover:shadow-lg hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:shadow-[var(--primary)]/10 dark:hover:shadow-[var(--primary)]/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] focus:ring-offset-2 dark:focus:ring-offset-[var(--background)] cursor-pointer"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden p-1.5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 relative">
                    <div className="transition-opacity duration-200 group-hover:opacity-0">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
                        {item.label}
                      </span>
                      <p className="mt-1 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                        {displayValue}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                        {item.description}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Open
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <div
                    data-nodeda-overlay
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('a[href*="request-service"]')) return;
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(NODEDA_HOMEPAGE_URL, "_blank", "noopener,noreferrer");
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      if ((e.target as HTMLElement).closest('a[href*="request-service"]')) return;
                      e.preventDefault();
                      window.open(NODEDA_HOMEPAGE_URL, "_blank", "noopener,noreferrer");
                    }}
                    className="absolute inset-0 rounded-2xl bg-[var(--background)] dark:bg-[var(--background)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 flex flex-col items-center justify-center p-6 border border-[var(--border-light)] cursor-pointer"
                    aria-label="Visit NodeDa (opens in new tab)"
                  >
                    <div className="flex justify-center mb-3" aria-hidden="true">
                      <img src={NODEDA_LOGO_LIGHT} alt="" className="h-7 w-auto dark:hidden object-contain" />
                      <img src={NODEDA_LOGO_DARK} alt="" className="h-7 w-auto hidden dark:block object-contain" />
                    </div>
                    <p className="text-center text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-4 leading-relaxed">
                      You&apos;re already on this website. Why not see what NodeDa can do for you?
                    </p>
                    <a
                      href={NODEDA_REQUEST_SERVICE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-center text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
                      aria-label="Request a consultation with NodeDa (opens in new tab)"
                    >
                      Get a consultation →
                    </a>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.a
                key={item.key}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                variants={itemVariants}
                aria-label={item.ariaLabel}
                className="group relative flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-[var(--background)] dark:bg-[var(--background)] border border-[var(--border-light)] shadow-sm hover:shadow-lg hover:border-[var(--primary)] dark:hover:border-[var(--primary)] hover:shadow-[var(--primary)]/10 dark:hover:shadow-[var(--primary)]/20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] focus:ring-offset-2 dark:focus:ring-offset-[var(--background)]"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden p-1.5">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 relative">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]">
                    {item.label}
                  </span>
                  <p className="mt-1 font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)] transition-colors">
                    {item.value}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-[var(--primary)] dark:text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Separator + NodeDa CTA */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.2 }}
          className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-[var(--border-light)]"
        >
          <div className="text-center">
            <p className="text-lg text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-5 max-w-xl mx-auto">
              Looking for development solutions? Contact NodeDa to get a consultation.
            </p>
            <GlowLink
              href={NODEDA_REQUEST_SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
              aria-label="Request a consultation with NodeDa (opens in new tab)"
            >
              Request a consultation
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </GlowLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
