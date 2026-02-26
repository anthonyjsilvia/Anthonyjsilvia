"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronRight } from "lucide-react";

const recommendations = [
  {
    name: "Elizabeth Smiley",
    role: "Sr. User Experience Manager at Lowe's Companies, Inc.",
    image: "/testimonials/Elizabeth Smiley.png",
    testimonial:
      "I've had the pleasure of managing Anthony Silvia, and he is an incredibly driven and collaborative Associate Designer with a true growth mindset.\n\nAnthony consistently designs with strong empathy for associates and customers, translating real-world workflows into thoughtful, intuitive solutions. For the products he supports, he delivers high-quality work grounded in usability, system thinking, and technical feasibility.\n\nHe brings a strong bias for action and ownership to everything he does. He effectively owned complex UX workflows end-to-end, keeping cross-functional partners aligned and work moving forward. He has also stepped up to lead AI-driven design efforts, proactively adopting emerging tools and helping the team think differently about how we work.\n\nAnthony embraces feedback, presents confidently to senior leadership, and continuously pushes himself to grow—all while balancing multiple product areas and continuing his education. He elevates the work around him and will be an asset to any team fortunate enough to work with him.",
  },
  {
    name: "Kristin Ludlow",
    role: "Product & Experience Leader | Enterprise Retail Systems | CSPO, UXC",
    image: "/testimonials/Kristin Ludlow.png",
    testimonial:
      "Anthony worked directly on my team and continues to support us from an adjacent team within the same vertical. I had the pleasure of interviewing him when he was joining Lowe's. He was recruited from our stores into our internal talent incubator (Launchpad) program by one of our senior executives, and a few years ago—has it really been that long?!—he officially joined our team.\n\nIf you're ever stranded on a deserted island, you want an Anthony. He's a true Swiss Army knife of a designer: deeply versatile, incredibly hardworking, and endlessly curious. He's the first to raise his hand, has no ego, and is remarkably open to coaching and feedback. On top of that, he's kind, funny, sweet-natured, and always ready to lend a hand.\n\nPractically speaking, Anthony has been instrumental in maturing our usability testing practice. He builds complex prototypes quickly and manages the tactical side of testing—from organizing logistics and writing scripts to conducting and moderating interviews. He's a flexible designer who can drop into any product space and ramp up fast. He collaborates well with a range of Product Management styles and can hold his own in technical conversations, thanks to his background in coding. He often brings fresh ideas and alternative approaches we hadn't considered, pushing our thinking forward.\n\nAnthony is an absolute joy to have on the team. I'm so grateful he chose to stay in Enterprise—especially in Post-Selling. He has a bright, rewarding career ahead of him.",
  },
  {
    name: "Melody Cassen",
    role: "EUX Senior Product Designer at Lowe's Companies, Inc.",
    image: "/testimonials/Melody Cassen.jpeg",
    testimonial:
      "Anthony is a joy to work with! Hard working, proactive and enterprising, he helped me on a variety of projects under tight deadlines and shifting priorities. His curiosity around emerging technologies keeps him on the forefront of what's new and how to leverage into his existing work flows.",
  },
  {
    name: "Lindsay Zierk",
    role: "Head of UX & Product Strategy | IBM, Lowe's, Home Depot",
    image: "/testimonials/Lindsay Zierk.jpeg",
    testimonial:
      "I've had the pleasure of working alongside Anthony and have always been impressed by his proactive nature. He has a natural hunger for learning (especially when it comes to the latest in AI) and he's even quicker to share that knowledge with others. Whenever a challenge arises, Anthony is there with a solution and a helping hand. He is a truly supportive and future-focused colleague!",
  },
];

export default function Recommendations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<typeof recommendations[0] | null>(null);

  // Prevent page scroll while modal is open
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selected]);

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
    <>
      <section
        id="recommendations"
        ref={ref}
        className="py-24 md:py-32 bg-white dark:bg-black"
        aria-labelledby="recommendations-heading"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-5">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          >
            <h2
              id="recommendations-heading"
              className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-6"
            >
              Recommendations
            </h2>
            <div className="w-24 h-1 bg-[var(--primary)] mx-auto rounded-full" />
            <p className="mt-6 text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] max-w-2xl mx-auto">
              Kind words from colleagues and managers I’ve worked with.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full"
          >
            {recommendations.map((rec, index) => (
              <motion.button
                key={rec.name}
                type="button"
                variants={itemVariants}
                onClick={() => setSelected(rec)}
                className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg border border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2 bg-[var(--bg-secondary)] dark:bg-[var(--bg-secondary)]"
                aria-label={`Read recommendation from ${rec.name}`}
              >
                <Image
                  src={rec.image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left flex items-end justify-between gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <div>
                    <p className="text-white font-semibold text-sm drop-shadow-md">{rec.name}</p>
                    <p className="text-white/90 text-xs drop-shadow-md">{rec.role}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white flex-shrink-0 drop-shadow-md md:group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial modal: image left, content right */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex p-0 md:p-4 items-stretch justify-stretch md:items-center md:justify-center bg-transparent md:bg-black/70 backdrop-blur-none md:backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-modal="true"
            aria-labelledby="testimonial-name"
            aria-describedby="testimonial-body"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="relative w-full h-full md:w-auto md:h-[420px] md:max-w-4xl md:max-h-[90vh] flex flex-col md:flex-row bg-white dark:bg-black rounded-none border-0 shadow-none md:rounded-2xl md:shadow-2xl md:border md:border-[var(--border-light)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: image — on mobile max ¼ screen height; desktop sets modal height */}
              <div className="relative w-full h-[33vh] md:w-[320px] md:h-[420px] md:aspect-auto flex-shrink-0 order-first">
                <Image
                  src={selected.image}
                  alt={`${selected.name}, ${selected.role}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              {/* Right: content — same height as image; testimonial scrolls */}
              <div className="flex-1 min-w-0 min-h-0 flex flex-col p-6 md:p-8 pt-12 md:pt-8">
                <motion.button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  aria-label="Close recommendation dialog"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
                <h3
                  id="testimonial-name"
                  className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-1"
                >
                  {selected.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] mb-3">
                  {selected.role}
                </p>
                <div className="w-full h-px bg-black/[0.18] dark:bg-white/[0.18] mb-4" aria-hidden="true" />
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/30 hover:[&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-track]:bg-white/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/30 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/40" id="testimonial-body" aria-live="polite">
                  <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {selected.testimonial}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
