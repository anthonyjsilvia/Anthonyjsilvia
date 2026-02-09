"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.3,
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

  if (!mounted) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-white dark:bg-black"
        aria-label="Hero section"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white">
            Anthony Silvia
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-black"
      aria-label="Hero section"
    >
      {/* Subtle background accent - AAA compliant */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)] opacity-5 dark:opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary)] opacity-5 dark:opacity-10 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Location badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm font-medium border border-[var(--border-light)]">
            Charlotte Metro
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-[var(--text-primary)] dark:text-[var(--text-primary)]"
        >
          Anthony Silvia
        </motion.h1>

        {/* Headline - EXACT from LinkedIn */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
        >
          Product Designer | Enterprise UX, Operational Workflows & Accessible Systems
        </motion.p>

        {/* CTA Row - View Resume, LinkedIn, Email */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[var(--primary)] text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="View Resume (opens in new tab)"
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            View Resume
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/anthonysilvia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white dark:bg-[var(--bg-secondary)] text-[var(--text-primary)] dark:text-[var(--text-primary)] rounded-lg font-semibold text-lg border-2 border-[var(--border-light)] hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Visit LinkedIn profile (opens in new tab)"
          >
            <Linkedin className="w-5 h-5" aria-hidden="true" />
            LinkedIn
          </motion.a>

          <motion.a
            href="https://shutterda.com/Anthony"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white dark:bg-[var(--bg-secondary)] text-[var(--text-primary)] dark:text-[var(--text-primary)] rounded-lg font-semibold text-lg border-2 border-[var(--border-light)] hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Visit ShutterDa portfolio (opens in new tab)"
          >
            <img src="/nodeda/ShutterDa.svg" alt="" className="w-5 h-5 brightness-0 dark:invert" aria-hidden="true" />
            ShutterDa
          </motion.a>

          <motion.a
            href="mailto:contact@anthonysilvia.com"
            className="px-8 py-4 bg-white dark:bg-[var(--bg-secondary)] text-[var(--text-primary)] dark:text-[var(--text-primary)] rounded-lg font-semibold text-lg border-2 border-[var(--border-light)] hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Send email to contact@anthonysilvia.com"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            Email
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
