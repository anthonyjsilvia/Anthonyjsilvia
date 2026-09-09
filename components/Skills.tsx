"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// EXACT LinkedIn content - word-for-word
const topSkills = [
  "Data Analysis",
  "Account Management",
  "Financial Analysis",
];

const languages = [
  { name: "American Sign Language", level: "Elementary" },
  { name: "English", level: "Native or Bilingual" },
  { name: "Español", level: "Elementary" },
];

const certifications = [
  "Introduction to Web Development (CS1005)",
  "UX Foundations: Accessibility",
  "Accounting (ACCT1001)",
  "Project Management (PM1001)",
  "Introduction to Statistics (STAT1001)",
];

const honorsAwards = [
  "Honor Roll",
  "Deans List",
  "Presidents list",
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
      },
    },
  };

  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-black"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="skills-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Skills & Certifications
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Top Skills */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6">
              Top Skills
            </h3>
            <ul className="space-y-3">
              {topSkills.map((skill, index) => (
                <li
                  key={skill}
                  className="flex items-center gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[var(--primary)]"
                    aria-hidden="true"
                  />
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Languages */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6">
              Languages
            </h3>
            <ul className="space-y-3">
              {languages.map((lang, index) => (
                <li
                  key={lang.name}
                  className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
                >
                  <span className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                    {lang.name}
                  </span>
                  {" "}({lang.level})
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Honors & Awards */}
          <motion.div
            variants={itemVariants}
            className="bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6">
              Honors & Awards
            </h3>
            <ul className="space-y-3">
              {honorsAwards.map((honor, index) => (
                <li
                  key={honor}
                  className="flex items-center gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[var(--primary)]"
                    aria-hidden="true"
                  />
                  {honor}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.6 }}
          className="bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
        >
          <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6">
            Certifications
          </h3>
          <ul className="space-y-3">
            {certifications.map((cert, index) => (
              <li
                key={cert}
                className="flex items-center gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
              >
                <span
                  className="w-2 h-2 rounded-full bg-[var(--primary)]"
                  aria-hidden="true"
                />
                {cert}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
