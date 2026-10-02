/** Design practice pillars, shared by homepage #practice + AnthonyOS app. */

export type AiPractice = {
  id: string;
  title: string;
  body: string;
};

export const aiPractices: AiPractice[] = [
  {
    id: "discovery",
    title: "Discovery & synthesis",
    body:
      "I use AI to cluster notes, surface patterns, and draft problem statements faster, then I validate with end users, stakeholders, and real operational constraints.",
  },
  {
    id: "exploration",
    title: "Exploration at speed",
    body:
      "AI helps me generate flows, variants, and copy options in minutes so I can pressure-test more directions per cycle, and still ship the one that earns stakeholder alignment.",
  },
  {
    id: "delivery",
    title: "Craft to production",
    body:
      "I move from AI-assisted exploration into Figma as the source of truth (components, specs, and handoff clarity) so engineering builds what we intended.",
  },
];

export const aiPracticeIntro = {
  eyebrow: "How I design",
  title: "AI accelerates exploration. Judgment ships the product.",
  lede:
    "Claude, Cursor, and Figma are part of my day-to-day practice for synthesis, prototyping, and delivery speed. Product judgment, accessibility, and stakeholder alignment still own the final call.",
};
