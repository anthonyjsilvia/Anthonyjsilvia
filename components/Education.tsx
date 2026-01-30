"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar, Award, Globe } from "lucide-react";

// EXACT LinkedIn Education entries - word-for-word
const education = [
  {
    institution: "Southern New Hampshire University",
    degree: "Master of Business Administration - MBA, Business Administration and Management, General",
    period: "Aug 2025 - Sep 2026",
  },
  {
    institution: "Southern New Hampshire University",
    degree: "Bachelors, Graphic Design and Media Arts, Minoring in User Experience Design",
    period: "May 2022 - Aug 2024",
  },
  {
    institution: "Wasilla High School",
    degree: "High School Diploma",
    period: "2015 - 2017",
  },
  {
    institution: "South Anchorage High School",
    degree: "",
    period: "June 2013 - June 2015",
  },
];

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

export default function Education() {
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
      id="education"
      ref={ref}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
      aria-labelledby="education-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="education-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Education
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        {/* Education Entries */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={`${edu.institution}-${index}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                transition={{ delay: index * 0.1, duration: shouldReduceMotion ? 0 : 0.6 }}
                className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-2">
                      {edu.institution}
                    </h3>
                    {edu.degree && (
                      <p className="text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-3">
                        {edu.degree}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <span>{edu.period}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills, Languages, Certifications, and Honors */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Top Skills */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Top Skills
              </h3>
            </div>
            <ul className="space-y-3">
              {topSkills.map((skill) => (
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
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Languages
              </h3>
            </div>
            <ul className="space-y-3">
              {languages.map((lang) => (
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

          {/* Certifications */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[var(--secondary)]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Certifications
              </h3>
            </div>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-start gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[var(--secondary)] mt-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Honors & Awards */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-[var(--border-light)]"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-[var(--accent)]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">
                Honors & Awards
              </h3>
            </div>
            <ul className="space-y-3">
              {honorsAwards.map((honor) => (
                <li
                  key={honor}
                  className="flex items-center gap-3 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[var(--accent)]"
                    aria-hidden="true"
                  />
                  {honor}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
