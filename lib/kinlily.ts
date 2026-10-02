/** Kinlily case + gallery — App Store marketing screens + product framing. */

export type KinlilyGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  surface: "App" | "Marketing";
};

export const kinlilyMeta = {
  title: "Kinlily",
  role: "Product ownership + UX",
  period: "Consumer product",
  summary:
    "End-to-end product ownership for Kinlily: discovery through delivery across research, experience design, and iteration for a cloud-connected consumer product.",
  problem:
    "People keep recipes, family stories, and plans scattered across screenshots, bookmarks, and notes. The product needed a clear, trustworthy home for that everyday complexity.",
  approach:
    "I owned discovery through delivery: framing the problem, shaping IA and interaction, and shipping polished mobile experiences with engineering partners.",
  outcome:
    "A live consumer app with App Store presence, evolving from cookbook roots into a broader Kinlily ecosystem. Gallery frames below are product marketing screens from the App Store listing.",
  appStoreUrl: "https://apps.apple.com/us/app/kinlily/id6803200193",
  siteUrl: "https://kinlily.com",
};

export const kinlilyGallery: KinlilyGalleryItem[] = [
  {
    id: "screen-1",
    src: "/portfolio/kinlily/gallery/app-screen-1.jpg",
    alt: "Kinlily App Store marketing — multi-phone product overview",
    caption: "App Store · product overview",
    surface: "Marketing",
  },
  {
    id: "screen-2",
    src: "/portfolio/kinlily/gallery/app-screen-2.jpg",
    alt: "Kinlily App Store marketing screen two",
    caption: "App Store · feature frame",
    surface: "Marketing",
  },
  {
    id: "screen-3",
    src: "/portfolio/kinlily/gallery/app-screen-3.jpg",
    alt: "Kinlily App Store marketing screen three",
    caption: "App Store · feature frame",
    surface: "Marketing",
  },
  {
    id: "screen-4",
    src: "/portfolio/kinlily/gallery/app-screen-4.jpg",
    alt: "Kinlily App Store marketing screen four",
    caption: "App Store · feature frame",
    surface: "Marketing",
  },
  {
    id: "screen-5",
    src: "/portfolio/kinlily/gallery/app-screen-5.jpg",
    alt: "Kinlily App Store marketing screen five",
    caption: "App Store · feature frame",
    surface: "Marketing",
  },
];
