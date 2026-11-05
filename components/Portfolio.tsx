"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { cineEase, dur, fadeUpBlur } from "@/lib/motion";
import { localizePortfolio } from "@/lib/i18n/localize-portfolio";
import { useMessages } from "@/lib/i18n/LocaleProvider";
import { portfolioProjects, type PortfolioProject } from "@/lib/portfolio";

function ProjectMedia({ project }: { project: PortfolioProject }) {
  if (project.image) {
    return (
      <div
        className="portfolio-cine__media-frame"
        style={
          project.imageZoom
            ? ({ ["--media-zoom"]: project.imageZoom } as CSSProperties)
            : undefined
        }
      >
        <Image
          src={project.image}
          alt=""
          fill
          className="portfolio-cine__media-img"
          sizes="(max-width: 900px) 100vw, 48vw"
          quality={90}
          style={
            project.imagePosition
              ? { objectPosition: project.imagePosition }
              : undefined
          }
        />
        {project.mediaBadge ? (
          <span className="portfolio-cine__media-badge">{project.mediaBadge}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="portfolio-cine__media-frame portfolio-cine__media-frame--typo"
      style={{ ["--project-accent" as string]: project.color }}
      aria-hidden="true"
    >
      <p className="portfolio-cine__media-kicker">{project.category}</p>
      <p className="portfolio-cine__media-mark">{project.subtitle}</p>
    </div>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const shouldReduceMotion = useReducedMotion();
  const n = String(index + 1).padStart(2, "0");
  const hasLink = Boolean(project.link);
  const isInternal =
    hasLink &&
    (project.link!.startsWith("/") || project.link!.startsWith("#"));
  const hasSecondary = Boolean(project.secondaryLink);
  const reverse = index % 2 === 1;
  const portfolio = useMessages().portfolio;
  const opensInNewTab = useMessages().chrome.opensInNewTab;

  const ariaLabel = hasLink
    ? isInternal
      ? `${project.title}. ${project.linkText ?? portfolio.open}.`
      : `${project.title}. ${project.linkText ?? portfolio.visitWebsite} (${opensInNewTab}).`
    : project.title;

  const body = (
    <>
      <span className="portfolio-cine__index" aria-hidden="true">
        {n}
      </span>

      <div className="portfolio-cine__visual">
        {hasLink && hasSecondary ? (
          <Link
            href={project.link!}
            aria-label={ariaLabel}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
          >
            <ProjectMedia project={project} />
          </Link>
        ) : (
          <ProjectMedia project={project} />
        )}
      </div>

      <div className="portfolio-cine__copy">
        {project.logo ? (
          <span className="portfolio-cine__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logo.light}
              alt={project.logo.alt}
              className="portfolio-cine__logo-img dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logo.dark}
              alt=""
              className="portfolio-cine__logo-img hidden dark:block"
            />
          </span>
        ) : (
          <p className="portfolio-cine__org">{project.subtitle}</p>
        )}
        <p className="portfolio-cine__category">{project.category}</p>
        <h2 className="portfolio-cine__project-title">{project.title}</h2>
        {project.companyStatus ? (
          <p className="portfolio-cine__status">{project.companyStatus}</p>
        ) : null}
        <p className="portfolio-cine__desc">{project.description}</p>
        {hasLink || hasSecondary ? (
          <span className="portfolio-cine__cta-row">
            {hasLink ? (
              hasSecondary ? (
                <Link
                  href={project.link!}
                  className="portfolio-cine__cta"
                  target={isInternal ? undefined : "_blank"}
                  rel={isInternal ? undefined : "noopener noreferrer"}
                >
                  {project.linkText}
                  <ArrowUpRight className="portfolio-cine__cta-icon" aria-hidden="true" />
                </Link>
              ) : (
                <span className="portfolio-cine__cta">
                  <span>{project.linkText}</span>
                  <ArrowUpRight className="portfolio-cine__cta-icon" aria-hidden="true" />
                </span>
              )
            ) : null}
            {hasSecondary ? (
              <a
                href={project.secondaryLink}
                className="portfolio-cine__cta"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                {project.secondaryLinkText ?? "Open Figma"}
                <ArrowUpRight className="portfolio-cine__cta-icon" aria-hidden="true" />
              </a>
            ) : null}
          </span>
        ) : null}
      </div>
    </>
  );

  const className = `portfolio-cine__row group${reverse ? " portfolio-cine__row--reverse" : ""}`;

  return (
    <motion.li
      ref={ref}
      id={`project-${project.id}`}
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 36,
        filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)",
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : {
              opacity: 0,
              y: shouldReduceMotion ? 0 : 36,
              filter: shouldReduceMotion ? "blur(0px)" : "blur(8px)",
            }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : dur.hero,
        delay: shouldReduceMotion ? 0 : 0.04,
        ease: cineEase,
      }}
      className="portfolio-cine__item scroll-mt-[5.5rem]"
    >
      {hasLink && !hasSecondary ? (
        isInternal ? (
          <Link href={project.link!} className={className} aria-label={ariaLabel}>
            {body}
          </Link>
        ) : (
          <a
            href={project.link!}
            className={className}
            aria-label={ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
          >
            {body}
          </a>
        )
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.li>
  );
}

/**
 * Homepage portfolio: cinematic project index in place of selected work.
 */
export default function Portfolio() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-8%" });
  const shouldReduceMotion = useReducedMotion();
  const headerReveal = fadeUpBlur(shouldReduceMotion, 28);
  const copy = useMessages().portfolio;
  const projects = localizePortfolio(portfolioProjects, copy.projects);

  return (
    <section
      id="portfolio"
      className="portfolio-cine scroll-mt-[4.75rem] border-t border-[var(--border-light)] bg-[var(--background)] py-14 md:py-20"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)]">
        <motion.header
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headerReveal}
          className="portfolio-cine__header mb-14 max-w-3xl md:mb-20"
        >
          <h2
            id="portfolio-heading"
            className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-[-0.03em] leading-[1.05] text-[var(--text-primary)]"
          >
            {copy.heading}
          </h2>
          <div
            aria-hidden="true"
            className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
          />
          <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)] md:text-[1.15rem] md:leading-[1.75]">
            {copy.intro}
          </p>
          <p className="mt-6">
            <Link
              href="/evidence"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(var(--primary-rgb),0.55)] transition-transform duration-[var(--dur-apple-sm)] hover:translate-y-[-1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              {copy.howIWork}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        </motion.header>

        <nav aria-label={copy.projectsNav} className="mb-12 md:mb-16">
          <ul className="flex flex-wrap gap-x-1 gap-y-2">
            {projects.map((p) => (
              <li key={p.id}>
                <a
                  href={`#project-${p.id}`}
                  className="inline-flex items-center rounded-full px-3 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                >
                  {p.subtitle}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul role="list" className="portfolio-cine__list">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
