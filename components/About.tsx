"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
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

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 md:py-32 bg-white dark:bg-black"
      aria-labelledby="about-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2
              id="about-heading"
              className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
            >
              About
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
          </motion.div>

          {/* Image and Content Layout */}
          <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start mb-12">
            {/* Profile Image */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:justify-start"
            >
              <div className="relative">
                <motion.div
                  className="rounded-full overflow-hidden shadow-2xl border-4 border-[var(--border-light)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: 0.3 }}
                >
                  <Image
                    src="/me.PNG"
                    alt="Anthony Silvia - Product Designer"
                    width={280}
                    height={280}
                    className="rounded-full object-cover w-[280px] h-[280px]"
                    priority
                  />
                </motion.div>
                {/* Decorative ring */}
                <div 
                  className="absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-20"
                  aria-hidden="true"
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed text-lg"
            >
              <p className="text-xl font-semibold text-[var(--text-primary)] dark:text-[var(--text-primary)] leading-relaxed">
                I am a Product Designer focused on building scalable, accessible
                enterprise systems grounded in real-world workflows and operational
                constraints.
              </p>
            </motion.div>
          </div>

          {/* Main Content - Full Width */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed text-lg max-w-4xl mx-auto"
          >
            <div className="prose prose-lg max-w-none">
              <p>
                I currently work as an Associate Product Designer at Lowe&apos;s, where
                I design and refine internal and customer-facing systems that
                support complex, high-volume retail operations. My work centers
                on improving usability, reducing workflow efficiency, and translating
                research insights into practical design decisions that align product,
                engineering, and business needs.
              </p>
              <p>
                Alongside my enterprise work, I founded NodeDa as an independent
                product design practice. Through NodeDa, I have led end-to-end product design efforts, including the design and launch of
                independent applications and selective consulting engagements.
                This experience has strengthened my ability to take ownership
                across the full product lifecycle, from discovery and definition through
                delivery, iteration, and post-launch learning.
              </p>
              <p>
                My background spans UX research, system design, accessibility-first design practices, and cross-functional collaboration. I am
                experienced in designing within WCAG 2.2 AA and AAA standards
                while balancing legacy systems, technical constraints, and
                operational realities.
              </p>
              <p>
                I approach design with a focus on clarity, accountability, and long-term impact. I value thoughtful tradeoffs, strong collaboration, and
                solutions that perform reliably at scale.
              </p>
              <p>
                Outside of work, I enjoy camping and spending time outdoors, which
                reinforces my appreciation for practical systems that function well
                under real-world conditions.
              </p>
              <p>
                I am open to connecting with others working on enterprise platforms,
                operational systems, and products that require disciplined design
                thinking and durable execution.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
