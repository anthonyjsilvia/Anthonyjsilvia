/** Selected work proof items, shared by homepage section + AnthonyOS app. */

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
    id: "lowes",
    href: "/portfolio/lowes",
    eyebrow: "Lowe's",
    title: "Retail associate-facing tech under NDA",
    context: "Request a confidential walkthrough of decision-level detail.",
    role: "Product design",
  },
  {
    id: "kinlily",
    href: "/portfolio/kinlily",
    eyebrow: "Kinlily",
    title: "Owned consumer product from discovery to launch",
    context: "End-to-end ownership with a live App Store gallery.",
    role: "Product + UX",
  },
  {
    id: "herbswift",
    href: "/portfolio/herbswift",
    eyebrow: "Herbswift",
    title: "UX and design systems across web and mobile",
    context: "Company-wide craft across iPhone, iPad, and web.",
    role: "Design systems",
  },
];
