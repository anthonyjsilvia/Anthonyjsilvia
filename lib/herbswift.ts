/** Herbswift case + gallery, shared by gallery page and portfolio cards. */

export type HerbswiftGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  surface: "iPhone" | "iPad" | "Web" | "App" | "Marketing";
};

export type HerbswiftPdf = {
  name: string;
  path: string;
};

export const herbswiftMeta = {
  title: "Herbswift",
  role: "Company-wide UX lead · Product Design + Design Systems",
  period: "2018",
  status: "Company no longer exists",
  summary:
    "Led UX and design systems across web and mobile for a multi-surface product. Work spanned iPhone, iPad, and web, establishing shared patterns, interaction craft, and high-fidelity specs for engineering.",
  problem:
    "Herbswift needed a coherent product experience across devices without a mature design system. Screens and flows risked drifting as features shipped independently.",
  approach:
    "I owned end-to-end UX across platforms: mapping core journeys, defining reusable patterns, and delivering build-ready visual and interaction specs for iOS and web.",
  outcome:
    "A documented multi-surface design language and a gallery of production-bound UI across phone, tablet, and web. Foundational craft I still draw on for systems and mobile UX work.",
};

export const herbswiftGallery: HerbswiftGalleryItem[] = [
  {
    id: "cover",
    src: "/portfolio/herbswift/cover.png",
    alt: "Herbswift marketing graphic with logo and iPhone product mockup",
    caption: "Marketing · product overview",
    surface: "Marketing",
  },
  {
    id: "iphone-1",
    src: "/portfolio/herbswift/gallery/iphone-x-p1.jpg",
    alt: "Herbswift iPhone X interface, primary product screen",
    caption: "iPhone X · primary product surface",
    surface: "iPhone",
  },
  {
    id: "iphone-3",
    src: "/portfolio/herbswift/gallery/iphone-x-p3.jpg",
    alt: "Herbswift iPhone X interface, secondary flow",
    caption: "iPhone X · flow detail",
    surface: "iPhone",
  },
  {
    id: "iphone-5",
    src: "/portfolio/herbswift/gallery/iphone-x-p5.jpg",
    alt: "Herbswift iPhone X interface, additional screen",
    caption: "iPhone X · supporting screen",
    surface: "iPhone",
  },
  {
    id: "ipad-1",
    src: "/portfolio/herbswift/gallery/ipad-p1.jpg",
    alt: "Herbswift iPad interface, tablet layout",
    caption: "iPad · expanded layout",
    surface: "iPad",
  },
  {
    id: "ipad-3",
    src: "/portfolio/herbswift/gallery/ipad-p3.jpg",
    alt: "Herbswift iPad interface, tablet detail",
    caption: "iPad · detail view",
    surface: "iPad",
  },
  {
    id: "web-1",
    src: "/portfolio/herbswift/gallery/web-p1.jpg",
    alt: "Herbswift web interface, desktop product view",
    caption: "Web · desktop product view",
    surface: "Web",
  },
  {
    id: "web-2",
    src: "/portfolio/herbswift/gallery/web-p2.jpg",
    alt: "Herbswift web interface, secondary desktop view",
    caption: "Web · secondary view",
    surface: "Web",
  },
  {
    id: "web-4",
    src: "/portfolio/herbswift/gallery/web-p4.jpg",
    alt: "Herbswift web interface, additional desktop screen",
    caption: "Web · supporting screen",
    surface: "Web",
  },
];

export const herbswiftPdfs: HerbswiftPdf[] = [
  { name: "iPad", path: "/portfolio/herbswift/pdfs/Herbswift iPad.pdf" },
  {
    name: "iPhone (4in, 4.7in, 5.5in)",
    path: "/portfolio/herbswift/pdfs/Herbswift iPhone (4in, 4.7in, 5.5in).pdf",
  },
  { name: "iPhone X", path: "/portfolio/herbswift/pdfs/Herbswift iPhone X.pdf" },
  {
    name: "App Build 08252018-B",
    path: "/portfolio/herbswift/pdfs/Herbswift App Build 08252018-B.pdf",
  },
  {
    name: "App Build 08242018",
    path: "/portfolio/herbswift/pdfs/Herbswift App Build 08242018.pdf",
  },
  {
    name: "App Build 080218",
    path: "/portfolio/herbswift/pdfs/Herbswift App - Build 080218.pdf",
  },
  {
    name: "Web Build 071118-14",
    path: "/portfolio/herbswift/pdfs/Herbswift Web - Build 071118-14.pdf",
  },
  {
    name: "Web Build 071018-39",
    path: "/portfolio/herbswift/pdfs/Herbswift Web - Build 071018-39.pdf",
  },
];
