"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileText, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const FADE_START = 0; // start fading as soon as user scrolls
const FADE_END = 0.27; // finish fading after ~27% of viewport (0.4 / 1.5)

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const fadeRange = vh * FADE_END;
      const progress = Math.min(1, scrollY / fadeRange);
      setBgOpacity(1 - progress);
    };

    handleScroll(); // set initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldReduceMotion]);

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
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <img
          src="/homepage/ashero.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative z-10 text-center">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-white">
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
      aria-labelledby="hero-heading"
    >
      {/* Full-viewport background image + overlay: fade on scroll */}
      <div
        className="absolute inset-0 transition-opacity duration-100 ease-out"
        style={{ opacity: shouldReduceMotion ? 1 : bgOpacity }}
        aria-hidden="true"
      >
        <img
          src="/homepage/ashero.PNG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center min-h-screen"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-opacity duration-100 ease-out"
        style={{ opacity: shouldReduceMotion ? 1 : bgOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Location badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
            Charlotte Metro
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          id="hero-heading"
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white drop-shadow-lg"
        >
          Anthony Silvia
        </motion.h1>

        {/* Headline: transitioning to PM; product design roots, enterprise & accessibility */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md"
        >
          Full-Stack Experience Manager | UX, Engineering & Data Integration
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
            aria-label="View resume, opens in new tab"
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            View Resume
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/anthonysilvia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/95 dark:bg-white/10 text-[var(--text-primary)] dark:text-white rounded-lg font-semibold text-lg border-2 border-white/30 hover:border-white hover:bg-white hover:text-[var(--primary)] dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Open LinkedIn profile in new tab"
          >
            <Linkedin className="w-5 h-5" aria-hidden="true" />
            LinkedIn
          </motion.a>

          <motion.a
            href="https://shutterda.com/Anthony"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/95 dark:bg-white/10 text-[var(--text-primary)] dark:text-white rounded-lg font-semibold text-lg border-2 border-white/30 hover:border-white hover:bg-white hover:text-[var(--primary)] dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Open ShutterDa portfolio in new tab"
          >
            <img src="/nodeda/ShutterDa.svg" alt="" className="w-5 h-5 brightness-0 dark:invert" aria-hidden="true" />
            ShutterDa
          </motion.a>

          <motion.a
            href="mailto:contact@anthonysilvia.com"
            className="px-8 py-4 bg-white/95 dark:bg-white/10 text-[var(--text-primary)] dark:text-white rounded-lg font-semibold text-lg border-2 border-white/30 hover:border-white hover:bg-white hover:text-[var(--primary)] dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] flex items-center gap-2 min-w-[180px] justify-center"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            aria-label="Send email to contact at anthonysilvia.com"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            Email
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
