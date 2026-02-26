"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Lock, Shield, X, FileText, Globe } from "lucide-react";

/** NodeDa projects: try iframe first, fall back to clickable placeholder if it fails to load */
function EmbedPreview({ project }: { project: { title: string; link: string; color: string } }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadedRef = useRef(false);
  loadedRef.current = loaded;

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
      {!showIframe && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center z-20 group"
          style={{ backgroundColor: project.color }}
          aria-label={`Open ${project.title} (opens in new tab)`}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }} />
          <div className="relative z-10 text-white text-center p-8">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-16 h-16 opacity-80" />
            </div>
            <p className="text-sm font-semibold opacity-90 mb-1">Website</p>
            <p className="text-xs opacity-70 group-hover:underline">View live site</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </a>
      )}
    </div>
  );
}

const projects = [
  {
    title: "Lowe's Sales Floor Kiosk",
    subtitle: "Lowe's Sales Floor Kiosk",
    description:
      "Currently contributing to an innovative in-store project at Lowe's. Approval from Lowe's required before sharing.",
    category: "Enterprise Innovation",
    technologies: ["Enterprise Systems", "UX Design", "Innovation"],
    image: "/portfoilo/paintdesk.jpeg.webp",
    link: "https://www.lowes.com",
    linkText: "Visit Lowe's Website",
    color: "#012169",
    period: "January 2025 - Present",
  },
  {
    title: "Lowe's Centralized Return to Vendor",
    subtitle: "Lowe's Centralized Return to Vendor",
    description:
      "Contributed to the design and prototyping of a centralized return to vendor system, streamlining the vendor return process.",
    category: "Enterprise System Design",
    technologies: ["Enterprise Systems", "UX Design", "Prototyping", "Process Optimization"],
    image: "/portfoilo/recieving.jpeg",
    link: "https://www.lowes.com",
    linkText: "Visit Lowe's Website",
    color: "#012169",
    period: "March 2023 - January 2025",
  },
  {
    title: "Lowe's Return Space",
    subtitle: "Lowe's Return Space",
    description:
      "Contributed to the enhancement of Lowe's return processing system, improving customer experience and operational efficiency in the return space.",
    category: "Enterprise POS System Enhancement",
    technologies: ["Enterprise Systems", "UX Design", "Prototyping", "User Research"],
    image: "/portfoilo/returns.jpeg",
    link: "https://www.lowes.com",
    linkText: "Visit Lowe's Website",
    color: "#012169",
    period: "December 2022 - March 2023",
  },
  {
    title: "Lowe's AI Chat Product",
    subtitle: "Lowe's AI Chat Product",
    description:
      "Contributed to the design and development of a confidential AI chat product at Lowe's. Approval from Lowe's required before sharing.",
    category: "Enterprise AI Innovation",
    technologies: ["Enterprise Systems", "UX Design", "AI/ML", "Conversational Design"],
    image: null,
    link: "https://www.lowes.com",
    linkText: "Visit Lowe's Website",
    color: "#012169",
    period: "August 2025 - January 2026",
    isConfidential: true,
  },
  {
    title: "Cookbook By NodeDa",
    subtitle: "Cloud-based cookbook ecosystem",
    description:
      "Recipe and cooking app by NodeDa. Independent product design and development.",
    category: "Product Design",
    technologies: ["UX Design", "Mobile Design", "iOS", "Product Design", "Product Management"],
    image: null,
    link: "https://cookbook.nodeda.com",
    linkText: "Visit cookbook.nodeda.com",
    color: "#3993C5",
    period: "NodeDa",
    embedWithIframe: true,
  },
  {
    title: "ShutterDa",
    subtitle: "ShutterDa",
    description:
      "Photography and portfolio platform. Design and product work through NodeDa.",
    category: "Product Design",
    technologies: ["UX Design", "Web Design", "Product Design", "Product Management"],
    image: null,
    link: "https://shutterda.com",
    linkText: "Visit ShutterDa.com",
    color: "#3993C5",
    period: "NodeDa",
    embedWithIframe: true,
  },
  {
    title: "Herbswift",
    subtitle: "Herbswift",
    description:
      "Led UX design for the entire company, creating comprehensive design systems across web and mobile platforms.",
    category: "Product Design",
    technologies: ["UX Design", "Mobile Design", "Web Design", "Design Systems"],
    image: null,
    link: null,
    linkText: null,
    color: "#38B548",
    period: "June 2018 - June 2019",
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
    title: "Rohde Architects",
    subtitle: "Rohde Architects",
    description:
      "Served as webmaster, managing and maintaining the company website, ensuring optimal performance and user experience. The website has been updated since my tenure.",
    category: "Web Development",
    technologies: ["Web Development", "Web Design", "Website Management", "Content Management", "Product Management"],
    image: null,
    link: "https://www.rohdearchitects.com",
    linkText: "Visit Website",
    color: "#FBBF24",
    period: "May 2017 - June 2018",
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
            <a
              href="/evidence"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] dark:bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] dark:focus:ring-offset-[var(--bg-secondary)] transition-opacity shadow-md"
              aria-label="Go to Evidence page, how I work"
            >
              Evidence - How I work
            </a>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-[var(--border-light)] flex flex-col"
              whileHover={shouldReduceMotion ? {} : { y: -10, scale: 1.02 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
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
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>
                  
                  {/* Security icon with lock */}
                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <div className="relative">
                        <Shield className="w-16 h-16 opacity-80" />
                        <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold opacity-90">Confidential requires release</p>
                  </div>
                  
                  {/* Subtle overlay to suggest hidden content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : project.pdfs ? (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>
                  
                  {/* Design documents icon */}
                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <FileText className="w-16 h-16 opacity-80" />
                    </div>
                    <p className="text-sm font-semibold opacity-90 mb-1">Design Documents</p>
                    <p className="text-xs opacity-70">{project.pdfs.length} design files available</p>
                  </div>
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : (project as { embedWithIframe?: boolean }).embedWithIframe && project.link ? (
                <EmbedPreview project={{ title: project.title, link: project.link, color: project.color }} />
              ) : project.link ? (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>
                  
                  {/* Website icon */}
                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <Globe className="w-16 h-16 opacity-80" />
                    </div>
                    <p className="text-sm font-semibold opacity-90 mb-1">Website</p>
                    <p className="text-xs opacity-70">View live site</p>
                  </div>
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              ) : (
                <div className="relative w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: project.color }}>
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10" aria-hidden="true">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                    }}></div>
                  </div>
                  
                  {/* Security icon with lock */}
                  <div className="relative z-10 text-white text-center p-8">
                    <div className="flex items-center justify-center mb-4" aria-hidden="true">
                      <div className="relative">
                        <Shield className="w-16 h-16 opacity-80" />
                        <Lock className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold opacity-90">Confidential requires release</p>
                  </div>
                  
                  {/* Subtle overlay to suggest hidden content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" aria-hidden="true"></div>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
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
                {project.period && (
                  <p className="text-xs text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-2 opacity-70">
                    {project.period}
                  </p>
                )}
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
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Link or PDF Viewer Button */}
                {project.link ? (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] mt-auto"
                    style={{ backgroundColor: project.color }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    aria-label={`${project.linkText} (opens in new tab)`}
                  >
                    {project.linkText}
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </motion.a>
                ) : project.pdfs ? (
                  <motion.button
                    onClick={() => {
                      setSelectedProject(project);
                      setSelectedPdf(project.pdfs[0].path);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] mt-auto"
                    style={{ backgroundColor: project.color }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    aria-label="View design documents"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    View Design Documents
                  </motion.button>
                ) : null}
              </div>
            </motion.div>
          ))}
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
