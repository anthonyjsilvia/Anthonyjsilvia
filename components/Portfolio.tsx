"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Lock, Shield, X, FileText, Globe } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";
import GlowLink from "@/components/GlowLink";

/** NodeDa projects: try iframe first, fall back to clickable placeholder if it fails to load */
function EmbedPreview({ project }: { project: { title: string; link: string; color: string } }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!loadedRef.current) setFailed(true);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const showIframe = loaded && !failed;

  return (
    <div className="relative w-full h-64 overflow-hidden bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]">
      <iframe
        src={project.link}
        title={`Preview: ${project.title}`}
        className={`absolute inset-0 w-full h-full border-0 ${showIframe ? "z-10 opacity-100" : "opacity-0 pointer-events-none"}`}
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setLoaded(true)}
        scrolling="no"
        referrerPolicy="no-referrer"
      />
      {/* Placeholder only - the portfolio card already wraps this preview in
          an outer <a>, so nesting another link here would be invalid HTML and
          trigger a React hydration error. */}
      {!showIframe && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }} />
          <div className="relative z-10 text-white text-center p-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-16 h-16 opacity-80" />
            </div>
            <p className="text-sm font-semibold opacity-90 mb-1">Website</p>
            <p className="text-xs opacity-70">View live site</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>
      )}
    </div>
  );
}

const projects = [
  // ----------------------------------------------------------------------
  //  Lowe's - all enterprise initiatives consolidated into one card with
  //  the confidential banner treatment. Each project ships under NDA, so
  //  the card surfaces outcomes and links to Evidence for how I work.
  // ----------------------------------------------------------------------
  {
    title: "Shipped product experience across in-store ops",
    subtitle: "Lowe's Companies, Inc.",
    description:
      "Product experience work across point-of-sale, store operations, returns, and AI conversational surfaces - discovery, prioritization, and shipped UX under NDA. See Evidence for decision-level detail without confidential UI.",
    category: "Enterprise Product Experience",
    technologies: [
      "Product Experience",
      "Discovery",
      "Prioritization",
      "UX Design",
      "Usability Testing",
      "Design Systems",
      "Accessibility",
      "Figma",
    ],
    image: null,
    link: "/evidence",
    linkText: "Evidence",
    color: "#012169",
    isConfidential: true,
  },
  {
    title: "Owned cookbook product from discovery to launch",
    subtitle: "Kinlily (NodeDa)",
    description:
      "End-to-end product ownership for a cloud-based cookbook ecosystem - research, experience design, and iteration as Principal Consultant at NodeDa.",
    category: "Product Management + UX",
    technologies: [
      "Product Management",
      "UX Design",
      "Mobile Design",
      "iOS",
      "Product Design",
    ],
    image: null,
    link: "https://kinlily.com",
    linkText: "Visit kinlily.com",
    color: "#3993C5",
    embedWithIframe: true,
  },
  {
    title: "Led UX and design systems across web and mobile",
    subtitle: "Herbswift",
    description:
      "Company-wide UX lead: comprehensive design systems and product experience across web and mobile platforms.",
    category: "Product Design + UX",
    technologies: [
      "UX Design",
      "Design Systems",
      "Product Design",
      "Mobile Design",
      "Web Design",
    ],
    image: null,
    link: null,
    linkText: null,
    color: "#38B548",
    pdfs: [
      { name: "iPad", path: "/portfoilo/Herbswift/Herbswift iPad.pdf" },
      { name: "iPhone (4in, 4.7in, 5.5in)", path: "/portfoilo/Herbswift/Herbswift iPhone (4in, 4.7in, 5.5in).pdf" },
      { name: "iPhone X", path: "/portfoilo/Herbswift/Herbswift iPhone X.pdf" },
      { name: "App Build 08252018-B", path: "/portfoilo/Herbswift/Herbswift App Build 08252018-B.pdf" },
      { name: "App Build 08242018", path: "/portfoilo/Herbswift/Herbswift App Build 08242018.pdf" },
      { name: "App Build 080218", path: "/portfoilo/Herbswift/Herbswift App - Build 080218.pdf" },
      { name: "Web Build 071118-14", path: "/portfoilo/Herbswift/Herbswift Web - Build 071118-14 .pdf" },
      { name: "Web Build 071018-39", path: "/portfoilo/Herbswift/Herbswift Web - Build 071018-39.pdf" },
    ],
    companyStatus: "Company no longer exists",
  },
  {
    title: "Owned website performance and content experience",
    subtitle: "Rohde Architects",
    description:
      "Served as webmaster with product ownership of the company site - performance, content, and user experience. The site has been updated since my tenure.",
    category: "Product + Web",
    technologies: [
      "Product Management",
      "Web Design",
      "Web Development",
      "Content Management",
      "UX",
    ],
    image: null,
    link: "https://www.rohdearchitects.com",
    linkText: "Visit Website",
    color: "#FBBF24",
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="portfolio"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-black"
      aria-labelledby="portfolio-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="portfolio-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Portfolio
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full mb-6" />
          <p className="text-center mb-2">
            <GlowLink
              href="/evidence"
              variant="primary"
              className="px-5 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] shadow-md"
              aria-label="Open Evidence page"
            >
              Evidence
            </GlowLink>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {projects.map((project) => {
            // Whole-card-clickable pattern. Each card's primary action - visit
            // a website, or open the design-docs PDF modal - wraps the entire
            // card body so the full surface is the hit target. The old bottom
            // CTA button is gone; a small inline "[icon] [label]" affordance
            // stays at the bottom of the body as a visual signal of what
            // clicking does.
            const hasLink = Boolean(project.link);
            const hasPdfs = Boolean(project.pdfs);
            const isInternalLink =
              hasLink && (project.link!.startsWith("/") || project.link!.startsWith("#"));
            const cardAriaLabel = hasLink
              ? isInternalLink
                ? `${project.title} - ${project.linkText ?? "Open"}`
                : `${project.title} - ${project.linkText ?? "Visit website"} (opens in new tab)`
              : hasPdfs
              ? `View ${project.title} design documents`
              : project.title;
            const innerClassName =
              "group relative flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-inset rounded-2xl";

            const cardBody = (
              <>
                <div
                  className="absolute top-0 left-0 right-0 h-2 z-20 depth-1"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />

                {/* Image or Placeholder */}
              {project.image ? (
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : project.isConfidential ? (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>

                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <div className="relative drop-shadow-lg">
                        <Shield className="w-16 h-16 opacity-80" />
                        <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold opacity-90">Confidential requires release</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : project.pdfs ? (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>

                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <FileText className="w-16 h-16 opacity-80 drop-shadow-lg" />
                    </div>
                    <p className="text-sm font-semibold opacity-90 mb-1">Design Documents</p>
                    <p className="text-xs opacity-70">{project.pdfs.length} design files available</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : (project as { embedWithIframe?: boolean }).embedWithIframe && project.link ? (
                <EmbedPreview project={{ title: project.title, link: project.link, color: project.color }} />
              ) : project.link ? (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>

                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <Globe className="w-16 h-16 opacity-80 drop-shadow-lg" />
                    </div>
                    <p className="text-sm font-semibold opacity-90 mb-1">Website</p>
                    <p className="text-xs opacity-70">View live site</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>

                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <div className="relative drop-shadow-lg">
                        <Shield className="w-16 h-16 opacity-80" />
                        <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold opacity-90">Confidential requires release</p>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              )}

              <div
                className="p-8 flex-1 flex flex-col relative"

              >
                <div className="mb-2">
                  <span className="text-sm font-semibold text-[var(--primary)] dark:text-[var(--primary)] uppercase tracking-wide">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-2 opacity-80">
                  {project.subtitle}
                </p>
                {project.companyStatus && (
                  <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-2 opacity-70 italic">
                    {project.companyStatus}
                  </p>
                )}
                <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-6 leading-relaxed flex-1">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: project.color }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Static CTA affordance.
                    The whole card is now the clickable element (wrapping
                    <a> or <button> around `cardBody`), so this block is
                    purely visual - a small icon + label in the project's
                    accent color that signals what clicking the card does.
                    It nudges right on hover via the group's hover state so
                    the affordance still feels interactive without being a
                    real button. */}
                {(hasLink || hasPdfs) && (
                  <div
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold transition-[gap] duration-200 group-hover:gap-3"
                    style={{ color: project.color }}
                  >
                    {hasPdfs ? (
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>
                      {hasLink ? project.linkText : "View Design Documents"}
                    </span>
                  </div>
                )}
              </div>
              </>
            );

            return (
              <motion.div key={project.title} variants={itemVariants}>
                <Tilt3D
                  max={7}
                  lift={22}
                  scale={1.02}
                  containerClassName="h-full"
                  className="card-3d bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] overflow-hidden h-full"
                >
                  {hasLink ? (
                    isInternalLink ? (
                      <Link
                        href={project.link!}
                        aria-label={cardAriaLabel}
                        className={innerClassName}
                      >
                        {cardBody}
                      </Link>
                    ) : (
                      <a
                        href={project.link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={cardAriaLabel}
                        className={innerClassName}
                      >
                        {cardBody}
                      </a>
                    )
                  ) : hasPdfs ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(project);
                        setSelectedPdf(project.pdfs![0].path);
                      }}
                      aria-label={cardAriaLabel}
                      className={innerClassName}
                    >
                      {cardBody}
                    </button>
                  ) : (
                    <div className="flex h-full w-full flex-col">
                      {cardBody}
                    </div>
                  )}
                </Tilt3D>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedProject && selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedProject(null);
              setSelectedPdf(null);
            }}
            aria-label="Close PDF viewer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-black rounded-lg shadow-2xl max-w-7xl w-full h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
                <div className="flex items-center gap-4 flex-1">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                    {selectedProject.title}
                  </h3>
                  <select
                    value={selectedPdf}
                    onChange={(e) => setSelectedPdf(e.target.value)}
                    className="px-4 py-2 border border-[var(--border-light)] rounded-lg bg-white dark:bg-black text-[var(--text-primary)] dark:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedProject.pdfs?.map((pdf) => (
                      <option key={pdf.path} value={pdf.path}>
                        {pdf.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setSelectedPdf(null);
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  aria-label="Close PDF viewer"
                >
                  <X className="w-6 h-6 text-[var(--text-primary)] dark:text-[var(--text-primary)]" />
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-auto p-4">
                <iframe
                  src={selectedPdf}
                  className="w-full h-full min-h-[600px] border border-[var(--border-light)] rounded-lg"
                  title={`PDF viewer for ${selectedProject.title}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
