/** Portfolio projects, shared by Portfolio page + AnthonyOS Portfolio app. */

export type PortfolioLogo = {
  /** Logo for light page backgrounds. */
  light: string;
  /** Logo for dark page backgrounds. */
  dark: string;
  /** Accessible label; keep empty alt if decorative beside visible name. */
  alt: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  technologies: string[];
  image: string | null;
  /** CSS object-position for the thumbnail crop. */
  imagePosition?: string;
  /** Extra zoom so letterboxed marketing art fills the frame (e.g. 1.12). */
  imageZoom?: number;
  logo?: PortfolioLogo;
  link: string | null;
  linkText: string | null;
  color: string;
  isConfidential?: boolean;
  companyStatus?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "lowes",
    title: "Retail associate-facing tech for enterprise ops",
    subtitle: "Lowe's Companies, Inc.",
    description:
      "Product design for tools retail associates rely on under pressure. Confidential under NDA. Request a private walkthrough of decision-level detail.",
    category: "Retail associate-facing tech",
    technologies: [
      "Product Design",
      "Discovery",
      "UX Design",
      "Usability Testing",
      "Design Systems",
      "Accessibility",
      "Figma",
    ],
    image: "/portfolio/lowes/cover.jpg",
    // Pan left so the store on the right stays in frame
    imagePosition: "88% 42%",
    logo: {
      light: "/portfolio/logos/lowes/logo-light.svg",
      dark: "/portfolio/logos/lowes/logo-dark.svg",
      alt: "Lowe's",
    },
    link: "/portfolio/lowes",
    linkText: "Request details",
    color: "#012169",
    isConfidential: true,
  },
  {
    id: "kinlily",
    title: "Owned consumer product from discovery to launch",
    subtitle: "Kinlily",
    description:
      "End-to-end product ownership for Kinlily: research, experience design, and iteration from discovery through launch.",
    category: "Product Management + UX",
    technologies: [
      "Product Management",
      "UX Design",
      "Mobile Design",
      "iOS",
      "Product Design",
    ],
    image: "/portfolio/kinlily/gallery/app-screen-1.jpg",
    logo: {
      light: "/portfolio/logos/kinlily/logo-light.svg",
      dark: "/portfolio/logos/kinlily/logo-dark.svg",
      alt: "Kinlily",
    },
    link: "/portfolio/kinlily",
    linkText: "Open gallery",
    color: "#3993C5",
  },
  {
    id: "nodeda-work",
    title: "Designed a unified suite for how teams actually work",
    subtitle: "NodeDa Work",
    description:
      "Product design for Boards, HR, Sign, Docs, Finance, CRM, and Surveys in one subscription. Clearer work with fewer tools, shipped as a live platform.",
    category: "Product Design + SaaS",
    technologies: [
      "Product Design",
      "UX Design",
      "Design Systems",
      "SaaS",
      "Information Architecture",
    ],
    image: "/portfolio/nodeda-work/cover.png",
    logo: {
      light: "/portfolio/logos/nodeda-work/logo-light.svg",
      dark: "/portfolio/logos/nodeda-work/logo-dark.svg",
      alt: "NodeDa Work",
    },
    link: "https://work.nodeda.com",
    linkText: "Visit NodeDa Work",
    color: "#3B82F6",
  },
  {
    id: "herbswift",
    title: "Led UX and design systems across web and mobile",
    subtitle: "Herbswift",
    description:
      "Company-wide UX lead: design systems and product experience across iPhone, iPad, and web. Gallery of curated craft from 2018 builds.",
    category: "Product Design + UX",
    technologies: [
      "UX Design",
      "Design Systems",
      "Product Design",
      "Mobile Design",
      "Web Design",
    ],
    image: "/portfolio/herbswift/cover.png",
    // Anchor near top so logo stays in frame; light zoom clears side gray
    imagePosition: "center top",
    imageZoom: 1.08,
    logo: {
      light: "/portfolio/logos/herbswift/logo-light.png",
      dark: "/portfolio/logos/herbswift/logo-dark.png",
      alt: "Herbswift",
    },
    link: "/portfolio/herbswift",
    linkText: "Open gallery",
    color: "#38B548",
    companyStatus: "Company no longer exists",
  },
];
