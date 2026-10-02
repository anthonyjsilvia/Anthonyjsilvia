/**
 * Site-wide search index - statically generated at build time.
 *
 * The index is intentionally a plain TypeScript module rather than a runtime
 * API call: Next.js statically resolves these imports during `next build`, so
 * the entire searchable surface of the site ships pre-computed in the SSR
 * bundle. There's no `/api/search` round trip, no client-side index fetch,
 * and no network latency - every keystroke filters an in-memory array.
 *
 * Dynamic routes pull from the same data sources their pages use (e.g.
 * `recommendations` from `lib/recommendations.ts`), which means adding a new
 * recommendation, page, or section automatically makes it searchable without
 * touching this file twice.
 */

import { recommendations } from "@/lib/recommendations";

export type SearchEntry = {
  /** Display title for the result row. */
  title: string;
  /** Optional secondary line under the title (role, summary, etc.). */
  description?: string;
  /** Internal route the result navigates to. */
  href: string;
  /** Grouping label shown on the right of the row ("Pages", "Recommendations"). */
  section: string;
  /** Synonyms / hidden tokens that should still match the entry. */
  keywords?: string[];
};

/**
 * Top-level page entries. Hand-curated so they ship with strong synonym
 * coverage (e.g. searching for "CV" finds the Resume page even though the
 * word never appears in the page title).
 */
const PAGE_ENTRIES: SearchEntry[] = [
  {
    title: "Home",
    section: "Pages",
    href: "/",
    description: "Anthony Silvia, MBA · Product Designer",
    keywords: [
      "home",
      "hero",
      "anthony silvia",
      "intro",
      "landing",
      "mba",
      "product designer",
    ],
  },
  {
    title: "Portfolio",
    section: "Pages",
    href: "/portfolio",
    description: "Selected projects and case studies",
    keywords: ["projects", "case study", "kinlily", "herbswift", "lowes", "nodeda", "portfolio", "work"],
  },
  {
    title: "Herbswift Gallery",
    section: "Pages",
    href: "/portfolio/herbswift",
    description: "UX and design systems across web and mobile",
    keywords: ["herbswift", "gallery", "mobile", "design systems", "ipad", "iphone"],
  },
  {
    title: "Kinlily Gallery",
    section: "Pages",
    href: "/portfolio/kinlily",
    description: "Consumer product ownership with App Store gallery",
    keywords: ["kinlily", "cookbook", "gallery", "ios", "app"],
  },
  {
    title: "Lowe's case request",
    section: "Pages",
    href: "/portfolio/lowes",
    description: "Request confidential retail associate-facing case details",
    keywords: ["lowes", "retail", "associate", "confidential", "nda", "request"],
  },
  {
    title: "Evidence",
    section: "Pages",
    href: "/evidence",
    description:
      "Evidence from shipped work: trade-offs, clarity, ambiguity, systems thinking",
    keywords: [
      "evidence",
      "how i work",
      "case study",
      "trade-offs",
      "ai",
      "practice",
      "confidential initiative",
      "product experience",
      "decision making",
      "redacted",
    ],
  },
  {
    title: "Experience",
    section: "Pages",
    href: "/experience",
    description: "Professional history, roles, and career timeline",
    keywords: [
      "career",
      "roles",
      "history",
      "lowes",
      "nodeda",
      "kinlily",
      "principal consultant",
      "product designer",
      "product manager",
    ],
  },
  {
    title: "Recommendations",
    section: "Pages",
    href: "/recommendations",
    description: "Recommendations from leaders and peers",
    keywords: [
      "recommendations",
      "testimonials",
      "kind words",
      "endorsements",
      "quotes",
    ],
  },
  {
    title: "Request Resume",
    section: "Pages",
    href: "/resume",
    description: "Request a private copy of the resume",
    keywords: ["cv", "resume", "pdf", "curriculum vitae", "request"],
  },
  {
    title: "Contact",
    section: "Pages",
    href: "/contact",
    description: "Get in touch",
    keywords: ["email", "hire", "reach out", "message"],
  },
];

/**
 * Recommendation detail pages - generated from the shared recommendations
 * data source so each new testimonial becomes searchable automatically.
 */
const RECOMMENDATION_ENTRIES: SearchEntry[] = recommendations.map((r) => ({
  title: r.name,
  section: "Recommendations",
  href: `/recommendations/${r.slug}`,
  description: r.role,
  keywords: ["testimonial", "recommendation", "endorsement", "quote"],
}));

/** Frozen, pre-sorted index. Pages first, then recommendations. */
export const SEARCH_INDEX: SearchEntry[] = [
  ...PAGE_ENTRIES,
  ...RECOMMENDATION_ENTRIES,
];

/**
 * Substring + weighted-keyword search. Tiny on purpose - for ~20 entries this
 * runs in well under a millisecond, so we re-run it on every keystroke
 * synchronously rather than debouncing. Title matches outrank keyword matches
 * outrank description matches.
 *
 * If the index ever grows past a few hundred entries, swap the body of this
 * function for `Fuse.js` (signature stays the same).
 */
export function searchSite(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX.slice(0, limit);

  const scored = SEARCH_INDEX.map((entry) => {
    const title = entry.title.toLowerCase();
    const description = (entry.description ?? "").toLowerCase();
    const keywords = (entry.keywords ?? []).map((k) => k.toLowerCase());

    let score = 0;
    if (title === q) score += 100; // exact title
    if (title.startsWith(q)) score += 40; // prefix
    if (title.includes(q)) score += 20; // anywhere in title
    if (keywords.some((k) => k === q)) score += 18;
    if (keywords.some((k) => k.includes(q))) score += 8;
    if (description.includes(q)) score += 3;

    return { entry, score };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
