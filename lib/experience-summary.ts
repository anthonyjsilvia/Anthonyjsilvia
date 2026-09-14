/**
 * Experience summary for AnthonyOS.
 * Mirrors the public career narrative on /experience (same employers & titles).
 */

export type OsExperienceRole = {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  bullets?: string[];
};

export const experienceRoles: OsExperienceRole[] = [
  {
    id: "lowes-current",
    company: "Lowe's Companies, Inc.",
    title: "Product Designer",
    period: "May 2026 - Present",
    location: "Charlotte, North Carolina · Hybrid",
    summary:
      "Own end-to-end product experience for critical internal systems across discovery, prioritization, and shipped UX.",
    bullets: [
      "Lead discovery, define success criteria, prioritize scope, and ship interaction design through usability validation.",
      "Use AI across the PXM loop while keeping product judgment and accessibility on the final call.",
      "Partner with product, engineering, operations, and end users on scalable, accessible experiences.",
    ],
  },
  {
    id: "lowes-prior",
    company: "Lowe's Companies, Inc.",
    title: "Product Designer",
    period: "October 2022 - May 2026",
    location: "Charlotte Metro · Hybrid",
    summary:
      "Led product experience for internal systems and AI-accelerated design practice in high-volume environments.",
    bullets: [
      "Improved usability and operational efficiency with product and engineering partners.",
      "Led AI-driven design efforts and usability testing that informed roadmap priorities.",
      "Evolved design systems with an accessibility-first approach (WCAG 2.2).",
    ],
  },
  {
    id: "lowes-earlier",
    company: "Lowe's Companies, Inc.",
    title: "Earlier Roles",
    period: "February 2019 - September 2022",
    location: "United States",
    summary:
      "Frontline and operational foundation that informs practical, enterprise-scale product experience work.",
  },
  {
    id: "nodeda",
    company: "NodeDa",
    title: "Principal Consultant",
    period: "May 2017 - Present",
    location: "United States",
    summary:
      "Independent consultancy for product strategy and experience design; launched Kinlily end-to-end.",
    bullets: [
      "Discovery-through-delivery engagements with AI-assisted exploration and delivery output.",
      "Hands-on product lifecycle ownership for Kinlily (formerly Cookbook).",
    ],
  },
];
