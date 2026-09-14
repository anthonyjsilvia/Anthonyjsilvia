/** Portfolio projects — shared by Portfolio page + AnthonyOS Portfolio app. */

export type PortfolioPdf = { name: string; path: string };

export type PortfolioProject = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  technologies: string[];
  image: string | null;
  link: string | null;
  linkText: string | null;
  color: string;
  isConfidential?: boolean;
  embedWithIframe?: boolean;
  pdfs?: PortfolioPdf[];
  companyStatus?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  // ----------------------------------------------------------------------
  //  Lowe's - all enterprise initiatives consolidated into one card with
  //  the confidential banner treatment. Each project ships under NDA, so
  //  the card surfaces outcomes and links to Evidence for how I work.
  // ----------------------------------------------------------------------
  {
    id: "lowes",
    title: "Shipped product experience across enterprise ops",
    subtitle: "Lowe's Companies, Inc.",
    description:
      "Product experience work across multiple enterprise retail initiatives, discovery, prioritization, and shipped UX under NDA. Initiative names, interfaces, and proprietary details stay redacted. See Evidence for decision-level proof without confidential content.",
    category: "Enterprise Product Experience",
    technologies: [
      "Product Experience",
      "Discovery",
      "Prioritization",
      "UX Design",
      "Usability Testing",
      "Design Systems",
      "Accessibility",
      "Figma",
    ],
    image: null,
    link: "/evidence",
    linkText: "Evidence",
    color: "#012169",
    isConfidential: true,
  },
  {
    id: "kinlily",
    title: "Owned cookbook product from discovery to launch",
    subtitle: "Kinlily (NodeDa)",
    description:
      "End-to-end product ownership for a cloud-based cookbook ecosystem - research, experience design, and iteration as Principal Consultant at NodeDa.",
    category: "Product Management + UX",
    technologies: [
      "Product Management",
      "UX Design",
      "Mobile Design",
      "iOS",
      "Product Design",
    ],
    image: null,
    link: "https://kinlily.com",
    linkText: "Visit kinlily.com",
    color: "#3993C5",
    embedWithIframe: true,
  },
  {
    id: "herbswift",
    title: "Led UX and design systems across web and mobile",
    subtitle: "Herbswift",
    description:
      "Company-wide UX lead: comprehensive design systems and product experience across web and mobile platforms.",
    category: "Product Design + UX",
    technologies: [
      "UX Design",
      "Design Systems",
      "Product Design",
      "Mobile Design",
      "Web Design",
    ],
    image: null,
    link: null,
    linkText: null,
    color: "#38B548",
    pdfs: [
      { name: "iPad", path: "/portfoilo/Herbswift/Herbswift iPad.pdf" },
      { name: "iPhone (4in, 4.7in, 5.5in)", path: "/portfoilo/Herbswift/Herbswift iPhone (4in, 4.7in, 5.5in).pdf" },
      { name: "iPhone X", path: "/portfoilo/Herbswift/Herbswift iPhone X.pdf" },
      { name: "App Build 08252018-B", path: "/portfoilo/Herbswift/Herbswift App Build 08252018-B.pdf" },
      { name: "App Build 08242018", path: "/portfoilo/Herbswift/Herbswift App Build 08242018.pdf" },
      { name: "App Build 080218", path: "/portfoilo/Herbswift/Herbswift App - Build 080218.pdf" },
      { name: "Web Build 071118-14", path: "/portfoilo/Herbswift/Herbswift Web - Build 071118-14 .pdf" },
      { name: "Web Build 071018-39", path: "/portfoilo/Herbswift/Herbswift Web - Build 071018-39.pdf" },
    ],
    companyStatus: "Company no longer exists",
  },
  {
    id: "rohde",
    title: "Owned website performance and content experience",
    subtitle: "Rohde Architects",
    description:
      "Served as webmaster with product ownership of the company site - performance, content, and user experience. The site has been updated since my tenure.",
    category: "Product + Web",
    technologies: [
      "Product Management",
      "Web Design",
      "Web Development",
      "Content Management",
      "UX",
    ],
    image: null,
    link: "https://www.rohdearchitects.com",
    linkText: "Visit Website",
    color: "#FBBF24",
  },
];