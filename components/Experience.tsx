"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import Tilt3D from "@/components/Tilt3D";

// NodeDa — projects and former clients, shown as buttons in Experience
const NODEDA_PROJECTS = [
  { name: "Kinlily", href: "https://kinlily.com", ariaLabel: "Visit Kinlily (opens in new tab)" },
];
const NODEDA_FORMER_CLIENTS = [
  { name: "Rohde Architects", href: "https://rohdearchitects.com", ariaLabel: "Visit Rohde Architects (opens in new tab)" },
];

// EXACT LinkedIn Experience entries - word-for-word
const experiences = [
  {
    company: "Lowe's Companies, Inc.",
    totalYears: "7 years",
    roles: [
      {
        title: "Associate Product Designer",
        period: "October 2022 - Present (3 years 4 months)",
        location: "Charlotte Metro",
        bullets: [
          "Lead the design and iteration of key internal systems, improving usability and workflow efficiency across complex, high-volume operational environments.",
          "Planned and facilitated usability testing, synthesizing research insights into actionable design decisions adopted by product and engineering partners.",
          "Produced detailed wireframes and interactive prototypes in Figma to communicate design intent, validate solutions, and align cross-functional stakeholders.",
          "Contributed to and extended internal design systems with an accessibility-first approach, ensuring consistency and scalability across products.",
          "Designed within WCAG 2.2 AA/AAA standards, balancing accessibility compliance with legacy system constraints and real-world operational needs.",
        ],
      },
      {
        title: "Earlier Roles",
        period: "February 2019 - September 2022 (3 years 8 months)",
        location: "United States",
        description: "Proactively took ownership of customer facing work and operational responsibilities, developing a deep understanding for store workflow, system limitations, and real world constraints. This foundation, directly informs my approach, designing practical, enterprise-scale tools.",
      },
    ],
  },
  {
    company: "NodeDa",
    totalYears: "8 years 9 months",
    roles: [
      {
        title: "Principal Consultant",
        period: "May 2017 - Present (8 years 9 months)",
        location: "United States",
        bullets: [
          "Founded NodeDa, an independent product design consultancy providing selective design and product strategy support to small businesses and early-stage products.",
          "Lead end-to-end product design engagements, from discovery and user research through wireframes, prototypes, and delivery-ready design assets.",
          "Developed and launched an independent iOS application (Kinlily, formerly Cookbook), gaining hands-on experience in product lifecycle ownership, iteration, and user engagement.",
        ],
      },
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="experience-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Experience
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-16">
          {experiences.map((exp, expIndex) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              transition={{ delay: expIndex * 0.2, duration: shouldReduceMotion ? 0 : 0.6 }}
            >
              <Tilt3D
                max={4}
                lift={14}
                scale={1.005}
                className="card-3d bg-white dark:bg-black p-8 md:p-10 rounded-2xl border border-[var(--border-light)]"
              >
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4" style={{ transform: "translateZ(18px)" }}>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2 flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[var(--primary)] drop-shadow-md" aria-hidden="true" />
                      {exp.company}
                    </h3>
                    <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-lg">
                      {exp.totalYears}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 mt-8">
                  {exp.roles.map((role, roleIndex) => (
                    <div
                      key={`${role.title}-${roleIndex}`}
                      className={roleIndex > 0 ? "pt-8 border-t border-[var(--border-light)]" : ""}
                    >
                      <h4 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        {role.title}
                      </h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span>{role.period}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                          <MapPin className="w-4 h-4" aria-hidden="true" />
                          <span>{role.location}</span>
                        </div>
                      </div>

                      {role.bullets && (
                        <ul className="space-y-3 mt-4">
                          {role.bullets.map((bullet, bulletIndex) => (
                            <li
                              key={bulletIndex}
                              className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] flex items-start gap-3 leading-relaxed"
                            >
                              <span
                                className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 flex-shrink-0"
                                aria-hidden="true"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {role.description && (
                        <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed mt-4">
                          {role.description}
                        </p>
                      )}
                    </div>
                  ))}

                {exp.company === "NodeDa" && (
                  <>
                    <div className="pt-8 border-t border-[var(--border-light)]">
                      <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        Projects
                      </h4>
                      <div className="flex flex-wrap gap-3" style={{ transform: "translateZ(20px)" }}>
                        {NODEDA_PROJECTS.map((project) => (
                          <a
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={project.ariaLabel}
                            className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-[var(--border-light)]">
                      <h4 className="text-lg font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4">
                        Former clients
                      </h4>
                      <div className="flex flex-wrap gap-3" style={{ transform: "translateZ(20px)" }}>
                        {NODEDA_FORMER_CLIENTS.map((project) => (
                          <a
                            key={project.name}
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={project.ariaLabel}
                            className="btn-3d inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                          >
                            {project.name}
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                </div>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
