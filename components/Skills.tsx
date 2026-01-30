"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Top Skills",
    skills: [
      { name: "Data Analysis", level: 90 },
      { name: "Account Management", level: 85 },
      { name: "Financial Analysis", level: 80 },
    ],
    color: "from-blue-600 to-blue-700",
  },
  {
    title: "Design & Development",
    skills: [
      { name: "UX Research", level: 95 },
      { name: "Web Development", level: 90 },
      { name: "Figma", level: 95 },
      { name: "UI/UX Design", level: 92 },
      { name: "Accessibility (WCAG)", level: 90 },
    ],
    color: "from-purple-600 to-purple-700",
  },
  {
    title: "Languages",
    skills: [
      { name: "English (Native)", level: 100 },
      { name: "American Sign Language (Elementary)", level: 40 },
      { name: "Español (Elementary)", level: 40 },
    ],
    color: "from-amber-600 to-amber-700",
  },
];

const certifications = [
  "Introduction to Web Development (CS1005)",
  "UX Foundations: Accessibility",
  "Accounting (ACCT1001)",
  "Project Management (PM1001)",
  "Introduction to Statistics (STAT1001)",
];

const honors = ["Honor Roll", "Dean's List", "President's List"];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-gray-900"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="skills-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Skills & Achievements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-900 dark:text-white font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={
                          isInView
                            ? { width: `${skill.level}%` }
                            : { width: 0 }
                        }
                        transition={{
                          delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          duration: 1,
                          ease: "easeOut",
                        }}
                        aria-label={`${skill.name} skill level: ${skill.level}%`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Certifications
            </h3>
            <ul className="space-y-3">
              {certifications.map((cert, index) => (
                <motion.li
                  key={cert}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                    aria-hidden="true"
                  />
                  {cert}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Honors & Awards
            </h3>
            <ul className="space-y-3">
              {honors.map((honor, index) => (
                <motion.li
                  key={honor}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600"
                    aria-hidden="true"
                  />
                  {honor}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


