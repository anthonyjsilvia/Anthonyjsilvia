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
    description: "Anthony Silvia - AI-accelerated Product Experience Manager",
    keywords: [
      "home",
      "hero",
      "anthony silvia",
      "intro",
      "landing",
      "ai",
      "artificial intelligence",
    ],
  },
  {
    title: "AI practice",
    section: "Pages",
    href: "/#ai",
    description:
      "How I use AI as a Product Experience Manager to raise efficiency and output",
    keywords: [
      "ai",
      "artificial intelligence",
      "generative ai",
      "efficiency",
      "throughput",
      "chatgpt",
      "copilot",
      "automation",
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
      "product experience manager",
      "product manager",
    ],
  },
  {
    title: "Portfolio",
    section: "Pages",
    href: "/portfolio",
    description: "Selected work and case studies",
    keywords: ["projects", "case study", "kinlily", "herbswift", "lowes"],
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
      "return space",
      "pro supply",
      "product experience",
      "decision making",
    ],
  },
  {
    title: "Resume",
    section: "Pages",
    href: "/resume",
    description: "Downloadable resume",
    keywords: ["cv", "pdf", "download", "curriculum vitae"],
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
