"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Portfolio from "@/components/Portfolio";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main id="main-content" className="min-h-screen">
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      <Navigation />
      {!shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-[var(--primary)] z-50 origin-left"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}
      <Hero />
      <About />
      <Experience />
      <Portfolio />
      <Education />
      <Contact />
      <Footer />
    </main>
  );
}
