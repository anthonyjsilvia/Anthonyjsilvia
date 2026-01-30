"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Globe } from "lucide-react";

// Contact information
const contactInfo = {
  email: "contact@anthonyjsilvia.com",
  linkedin: "www.linkedin.com/in/anthonyjsilvia",
  personal: "anthonyjsilvia.com",
};

export default function Contact() {
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
      id="contact"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-black"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2
            id="contact-heading"
            className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
          >
            Contact
          </h2>
          <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
        </motion.div>

        {/* Contact Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-8 text-center">
            Get in Touch
          </h3>
          <div className="space-y-6">
            <motion.a
              href={`mailto:${contactInfo.email}`}
              variants={itemVariants}
              className="flex items-center gap-4 p-6 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)] transition-all group focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] border border-[var(--border-light)]"
              aria-label={`Send email to ${contactInfo.email}`}
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm font-medium mb-1">
                  Email
                </div>
                <div className="text-[var(--text-primary)] dark:text-[var(--text-primary)] font-semibold">
                  {contactInfo.email}
                </div>
              </div>
            </motion.a>

            <motion.a
              href={`https://${contactInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="flex items-center gap-4 p-6 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)] transition-all group focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] border border-[var(--border-light)]"
              aria-label={`Visit LinkedIn profile (opens in new tab)`}
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <Linkedin className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm font-medium mb-1">
                  LinkedIn
                </div>
                <div className="text-[var(--text-primary)] dark:text-[var(--text-primary)] font-semibold">
                  {contactInfo.linkedin}
                </div>
              </div>
            </motion.a>

            <motion.a
              href={`https://${contactInfo.personal}`}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="flex items-center gap-4 p-6 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] dark:hover:bg-[var(--bg-tertiary)] transition-all group focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] border border-[var(--border-light)]"
              aria-label={`Visit personal website (opens in new tab)`}
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-sm font-medium mb-1">
                  Personal
                </div>
                <div className="text-[var(--text-primary)] dark:text-[var(--text-primary)] font-semibold">
                  {contactInfo.personal}
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
