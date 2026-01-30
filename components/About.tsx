"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Target, Rocket } from "lucide-react";

const strengths = [
  {
    icon: Lightbulb,
    title: "Innovative Design",
    description: "Designing user-friendly platforms for modern business needs",
  },
  {
    icon: Target,
    title: "Accessibility Focus",
    description: "Leading teams with collaborative energy and a focus on accessibility",
  },
  {
    icon: Rocket,
    title: "Scalable Solutions",
    description: "Keeping startups lean, efficient, and scalable with robust tech stacks",
  },
];

export default function About() {
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
      id="about"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-gray-900"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2
              id="about-heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              About Me
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16"
          >
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Hi, I&apos;m <strong className="text-gray-900 dark:text-white">Anthony Silvia</strong>—a dynamic
              problem-solver at the intersection of software design, innovation,
              and user-centric solutions. I currently serve as an{" "}
              <strong className="text-gray-900 dark:text-white">Associate Product Designer</strong> at
              Lowe&apos;s, crafting seamless experiences for customers and
              internal teams.
            </p>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              At the same time, I&apos;m the <strong className="text-gray-900 dark:text-white">Principal at NodeDa</strong>, where I lead the
              development of groundbreaking tools like live transcription software
              (NodeDa Lingo) and other amazing projects.
            </p>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              With a strong foundation in UX research, web development, and
              startup growth, I specialize in delivering intuitive, scalable
              solutions that solve real-world problems while pushing the
              boundaries of technology.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {strengths.map((strength, index) => {
              const Icon = strength.icon;
              return (
                <motion.div
                  key={strength.title}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {strength.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {strength.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg md:text-xl font-medium">
              Fun fact: I&apos;m passionate about transforming complex problems
              into elegant solutions—fueled by caffeine-free herbal tea and a
              knack for building Lego apartments in my downtime.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


