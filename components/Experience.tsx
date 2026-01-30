"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    company: "Lowe's Companies, Inc.",
    role: "Associate Product Designer",
    period: "October 2022 - Present",
    location: "Charlotte Metro",
    duration: "3 years 3 months",
    description: [
      "Support the design and refinement of key systems to improve usability and workflow efficiency.",
      "Conduct usability testing and synthesize user research findings into actionable design recommendations.",
      "Create detailed wireframes and prototypes using Figma to communicate design intent effectively.",
    ],
    color: "from-blue-600 to-blue-700",
  },
  {
    company: "Lowe's Companies, Inc.",
    role: "Various Retail Roles",
    period: "February 2019 - September 2022",
    location: "United States",
    duration: "3 years 8 months",
    description: [
      "Provided exceptional customer service, winning multiple awards for addressing complex needs and fostering positive interactions.",
      "Developed strong product knowledge in flooring and installation sales to meet customer needs and drive sales.",
      "Managed and trained cashiers, coordinated scheduling, and upheld operational efficiency as a Head Cashier.",
    ],
    color: "from-purple-600 to-purple-700",
  },
  {
    company: "NodeDa",
    role: "Founder & Sole Proprietor",
    period: "April 2022 - Present",
    location: "Remote",
    duration: "3 years 9 months",
    description: [
      "Led the development of modern designed applications at NodeDa, focusing on marketing and business development.",
      "Implemented accessible features to ensure a user-friendly experience for all customers.",
      "Spearheaded the company's growth strategy, resulting in a significant increase in market share.",
    ],
    color: "from-amber-600 to-amber-700",
  },
  {
    company: "Freelance",
    role: "Web Designer",
    period: "May 2017 - June 2019",
    location: "Tempe, Arizona, United States",
    duration: "2 years 2 months",
    description: [
      "Designed websites for small businesses, focusing on user-friendly interfaces and engaging designs.",
      "Collaborated with startups under ndas to create visually appealing and functional websites.",
      "Utilized skills in graphic design, UX/UI principles, and coding to bring clients' visions to life.",
    ],
    color: "from-green-600 to-green-700",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={ref}
      className="py-24 md:py-32 bg-gray-50 dark:bg-gray-800"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="experience-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-amber-600 transform md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                className="relative flex items-start"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
                }
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${exp.color} transform md:-translate-x-1/2 z-10 border-4 border-white dark:border-gray-800`}
                  aria-hidden="true"
                />

                {/* Content card */}
                <div
                  className={`ml-20 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                  }`}
                >
                  <motion.div
                    className={`bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-gradient-to-b ${exp.color}`}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                          <Briefcase className="w-5 h-5" aria-hidden="true" />
                          {exp.company}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        <span>{exp.period}</span>
                        <span className="text-gray-400 dark:text-gray-500">•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
                        >
                          <span
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${exp.color} mt-2 flex-shrink-0`}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


