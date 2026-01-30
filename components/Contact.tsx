"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, Linkedin, Globe, Send } from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@anthonyjsilvia.com",
    href: "mailto:contact@anthonyjsilvia.com",
    ariaLabel: "Send email to contact@anthonyjsilvia.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(910) 610-5315",
    href: "tel:+19106105315",
    ariaLabel: "Call (910) 610-5315",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/anthonyjsilvia",
    href: "https://www.linkedin.com/in/anthonyjsilvia",
    ariaLabel: "Visit Anthony Silvia's LinkedIn profile (opens in new tab)",
  },
  {
    icon: Globe,
    label: "Website",
    value: "design.nodeda.com/anthony-silvia/",
    href: "https://design.nodeda.com/anthony-silvia/",
    ariaLabel: "Visit Anthony Silvia's personal website (opens in new tab)",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1000);
  };

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
      id="contact"
      ref={ref}
      className="py-24 md:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="contact-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Let&apos;s Connect
          </h2>
          <div className="w-24 h-1 bg-white mx-auto rounded-full mb-6" />
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            I&apos;m open to networking, collaborations, and opportunities where
            innovation meets impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3 className="text-2xl font-bold text-white mb-8">
              Get in Touch
            </h3>
            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    variants={itemVariants}
                    className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all group focus:outline-none focus:ring-4 focus:ring-white/50"
                    whileHover={{ scale: 1.05, x: 10 }}
                    aria-label={method.ariaLabel}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-white/80 text-sm font-medium mb-1">
                        {method.label}
                      </div>
                      <div className="text-white font-semibold">
                        {method.value}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-600 dark:bg-gray-800 dark:text-white text-gray-900"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Email <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-600 dark:bg-gray-800 dark:text-white text-gray-900"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Message <span className="text-red-500" aria-label="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 focus:border-blue-600 dark:bg-gray-800 dark:text-white text-gray-900 resize-none"
                  aria-required="true"
                />
              </div>
              <motion.button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: formStatus === "sending" ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === "sending" ? 1 : 0.98 }}
              >
                {formStatus === "sending" ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : formStatus === "success" ? (
                  <>
                    <span>✓</span>
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" aria-hidden="true" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


