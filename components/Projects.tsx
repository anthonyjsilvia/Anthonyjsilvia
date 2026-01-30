"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Code, Users, Zap } from "lucide-react";

const projects = [
  {
    title: "NodeDa Lingo",
    description:
      "Live transcription software that provides real-time accessibility solutions. A groundbreaking tool designed to break down communication barriers.",
    features: [
      "Real-time transcription",
      "Accessibility-first design",
      "Modern, scalable architecture",
    ],
    tech: ["Firebase", "React", "Web APIs"],
    color: "from-blue-600 to-purple-600",
    icon: Zap,
    link: "https://design.nodeda.com/anthony-silvia/",
  },
  {
    title: "NodeDa Platform",
    description:
      "Leading the development of modern designed applications focusing on marketing and business development. Implementing accessible features for all users.",
    features: [
      "Accessible design system",
      "Business development tools",
      "Marketing automation",
    ],
    tech: ["Next.js", "Firebase", "Figma"],
    color: "from-purple-600 to-pink-600",
    icon: Code,
    link: "https://design.nodeda.com/anthony-silvia/",
  },
  {
    title: "Lowe's Design Systems",
    description:
      "Supporting the design and refinement of key systems to improve usability and workflow efficiency for both customers and internal teams.",
    features: [
      "Usability testing",
      "User research synthesis",
      "Figma prototypes",
    ],
    tech: ["Figma", "Design Systems", "UX Research"],
    color: "from-amber-600 to-orange-600",
    icon: Users,
    link: "https://www.lowes.com",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="py-24 md:py-32 bg-gray-50 dark:bg-gray-800"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="projects-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Innovative solutions that solve real-world problems and push the
            boundaries of technology
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                variants={itemVariants}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${project.color}`}
                  aria-hidden="true"
                />
                <div className="p-8">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {project.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} mt-1.5 flex-shrink-0`}
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Visit ${project.title} project (opens in new tab)`}
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </motion.a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


