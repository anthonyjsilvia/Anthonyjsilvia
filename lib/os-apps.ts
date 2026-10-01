/**
 * AnthonyOS app registry - each "application" maps to a native OS UI,
 * site page, or chrome function (terminal, accessibility).
 */

export type OsAppAction = "native" | "terminal";

export type OsApp = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  action: OsAppAction;
  /** Canonical site route for “Open full page” / search. */
  href?: string;
  tint: string;
  icon:
    | "home"
    | "briefcase"
    | "layout"
    | "evidence"
    | "sparkles"
    | "file"
    | "mail"
    | "quote"
    | "terminal"
    | "accessibility"
    | "work"
    | "about"
    | "user";
};

export const OS_APPS: OsApp[] = [
  {
    id: "home",
    name: "Home",
    subtitle: "Overview",
    description: "Product Experience Manager positioning and shortcuts.",
    action: "native",
    href: "/",
    tint: "rgb(0, 82, 204)",
    icon: "home",
  },
  {
    id: "work",
    name: "Selected Work",
    subtitle: "Proof",
    description: "Problem, decision, outcome from shipped work.",
    action: "native",
    href: "/#work",
    tint: "rgb(40, 110, 170)",
    icon: "work",
  },
  {
    id: "ai",
    name: "AI Practice",
    subtitle: "Leverage",
    description: "How AI raises efficiency across discovery through delivery.",
    action: "native",
    href: "/#ai",
    tint: "rgb(35, 120, 200)",
    icon: "sparkles",
  },
  {
    id: "about",
    name: "About",
    subtitle: "Profile",
    description: "MBA Product Experience Manager bio and portrait.",
    action: "native",
    href: "/#about",
    tint: "rgb(70, 90, 120)",
    icon: "about",
  },
  {
    id: "recommendations",
    name: "Kind Words",
    subtitle: "Recommendations",
    description: "Notes from leaders and peers who saw the work up close.",
    action: "native",
    href: "/kind-words",
    tint: "rgb(140, 80, 95)",
    icon: "quote",
  },
  {
    id: "experience",
    name: "Experience",
    subtitle: "Career",
    description: "Roles, timeline, and career history.",
    action: "native",
    href: "/experience",
    tint: "rgb(0, 122, 140)",
    icon: "briefcase",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    subtitle: "Projects",
    description: "Case studies and shipped product experience.",
    action: "native",
    href: "/portfolio",
    tint: "rgb(55, 100, 145)",
    icon: "layout",
  },
  {
    id: "evidence",
    name: "Evidence",
    subtitle: "How I work",
    description: "Trade-offs, clarity, ambiguity, and systems thinking.",
    action: "native",
    href: "/evidence",
    tint: "rgb(180, 100, 45)",
    icon: "evidence",
  },
  {
    id: "resume",
    name: "Request Resume",
    subtitle: "Private",
    description: "Request a private copy of the resume — not publicly downloadable.",
    action: "native",
    href: "/resume",
    tint: "rgb(90, 90, 100)",
    icon: "file",
  },
  {
    id: "contact",
    name: "Contact",
    subtitle: "Inbox",
    description: "Get in touch about product experience roles and projects.",
    action: "native",
    href: "/contact",
    tint: "rgb(40, 150, 90)",
    icon: "mail",
  },
  {
    id: "terminal",
    name: "Terminal",
    subtitle: "⌘K",
    description: "Keyboard-only command line for navigating the site.",
    action: "terminal",
    tint: "rgb(30, 30, 34)",
    icon: "terminal",
  },
  {
    id: "accessibility",
    name: "Accessibility",
    subtitle: "Settings",
    description: "Motion, typeface, transparency, and color scheme preferences.",
    action: "native",
    tint: "rgb(0, 82, 204)",
    icon: "accessibility",
  },
];

export const OS_DOCK_APPS = OS_APPS;
