/** Selected work proof items — shared by homepage section + AnthonyOS app. */

export type SelectedWorkItem = {
  id: string;
  href: string;
  eyebrow: string;
  title: string;
  context: string;
  role: string;
};

export const selectedWorkItems: SelectedWorkItem[] = [
  {
    id: "ambiguity",
    href: "/evidence#ambiguity",
    eyebrow: "Lowe's",
    title: "Defined success criteria when “better CX” was vague",
    context:
      "Confidential initiative A: short discovery with frontline users and managers turned fuzzy goals into measurable direction for faster completion and fewer follow-ups.",
    role: "Design + product partnership",
  },
  {
    id: "trade-offs",
    href: "/evidence#trade-offs",
    eyebrow: "Lowe's",
    title: "Prioritized scope so the first release could ship",
    context:
      "Confidential initiative B: aligned leadership on timeline and highest-impact flows, balancing ideal UX against build complexity without blocking delivery.",
    role: "Prioritization & stakeholder alignment",
  },
  {
    id: "kinlily",
    href: "/portfolio",
    eyebrow: "NodeDa",
    title: "Owned discovery through delivery on an indie product",
    context:
      "Kinlily: end-to-end product lifecycle ownership, research, design, and iteration for a cloud cookbook experience.",
    role: "Product ownership + UX",
  },
];
