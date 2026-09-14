/** AI practice pillars — shared by homepage #ai + AnthonyOS app. */

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
      "AI helps me generate flows, variants, and copy options in minutes so I can pressure-test more directions per cycle - and still ship the one that earns stakeholder alignment.",
  },
  {
    id: "delivery",
    title: "Delivery leverage",
    body:
      "From tickets and acceptance criteria to research scripts and handoff notes, AI cuts busywork so I spend more time on prioritization, trade-offs, and experience quality.",
  },
  {
    id: "multiplier",
    title: "Team multiplier",
    body:
      "I lead AI-assisted design practice: share workflows, raise the bar on judgment over generation, and help partners move from drafts to production-ready product experience.",
  },
];

export const aiPracticeIntro = {
  eyebrow: "AI practice",
  title: "AI as product leverage, not a substitute for judgment.",
  lede:
    "As an MBA Product Experience Manager, I use AI to raise efficiency and output across discovery, exploration, and delivery - with human judgment owning what ships.",
};
