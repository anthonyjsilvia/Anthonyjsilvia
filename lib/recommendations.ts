/**
 * Recommendation testimonials — shared data source.
 *
 * Each recommendation has its own canonical URL at
 * `/recommendations/<slug>` (see `app/recommendations/[slug]/page.tsx`),
 * which keeps individual quotes shareable / bookmarkable and avoids the
 * focus / stacking-context gymnastics of an in-page modal.
 *
 * To add a new recommendation:
 *   1. Drop the portrait into `public/testimonials/<Name>.png`.
 *   2. (Optional) Run `npm run generate:subject-masks` to produce a
 *      `<Name>-subject.png` for the Apple-TV-card parallax effect.
 *   3. Add an entry below with a stable `slug` (kebab-case, ASCII only).
 *   4. The sitemap and detail route pick up new entries automatically.
 */

export type Recommendation = {
  /** Stable kebab-case identifier used as the URL segment. */
  slug: string;
  name: string;
  role: string;
  /** Full portrait (background intact). Used on the card and detail page. */
  image: string;
  /**
   * Optional background-removed PNG of just the subject. When present,
   * `AppleTVCard` uses it to do the three-layer parallax pop on hover.
   * The card gracefully degrades to a single-image render when absent.
   */
  subject?: string;
  /** Original testimonial copy. `\n\n` paragraph breaks are preserved. */
  testimonial: string;
};

export const recommendations: Recommendation[] = [
  {
    slug: "elizabeth-smiley",
    name: "Elizabeth Smiley",
    role: "Sr. User Experience Manager at Lowe's Companies, Inc.",
    image: "/testimonials/Elizabeth Smiley.png",
    subject: "/testimonials/Elizabeth Smiley-subject.png",
    testimonial:
      "I've had the pleasure of managing Anthony Silvia, and he is an incredibly driven and collaborative Associate Designer with a true growth mindset.\n\nAnthony consistently designs with strong empathy for associates and customers, translating real-world workflows into thoughtful, intuitive solutions. For the products he supports, he delivers high-quality work grounded in usability, system thinking, and technical feasibility.\n\nHe brings a strong bias for action and ownership to everything he does. He effectively owned complex UX workflows end-to-end, keeping cross-functional partners aligned and work moving forward. He has also stepped up to lead AI-driven design efforts, proactively adopting emerging tools and helping the team think differently about how we work.\n\nAnthony embraces feedback, presents confidently to senior leadership, and continuously pushes himself to grow—all while balancing multiple product areas and continuing his education. He elevates the work around him and will be an asset to any team fortunate enough to work with him.",
  },
  {
    slug: "kristin-ludlow",
    name: "Kristin Ludlow",
    role: "Product & Experience Leader | Enterprise Retail Systems | CSPO, UXC",
    image: "/testimonials/Kristin Ludlow.png",
    subject: "/testimonials/Kristin Ludlow-subject.png",
    testimonial:
      "Anthony worked directly on my team and continues to support us from an adjacent team within the same vertical. I had the pleasure of interviewing him when he was joining Lowe's. He was recruited from our stores into our internal talent incubator (Launchpad) program by one of our senior executives, and a few years ago—has it really been that long?!—he officially joined our team.\n\nIf you're ever stranded on a deserted island, you want an Anthony. He's a true Swiss Army knife of a designer: deeply versatile, incredibly hardworking, and endlessly curious. He's the first to raise his hand, has no ego, and is remarkably open to coaching and feedback. On top of that, he's kind, funny, sweet-natured, and always ready to lend a hand.\n\nPractically speaking, Anthony has been instrumental in maturing our usability testing practice. He builds complex prototypes quickly and manages the tactical side of testing—from organizing logistics and writing scripts to conducting and moderating interviews. He's a flexible designer who can drop into any product space and ramp up fast. He collaborates well with a range of Product Management styles and can hold his own in technical conversations, thanks to his background in coding. He often brings fresh ideas and alternative approaches we hadn't considered, pushing our thinking forward.\n\nAnthony is an absolute joy to have on the team. I'm so grateful he chose to stay in Enterprise—especially in Post-Selling. He has a bright, rewarding career ahead of him.",
  },
  {
    slug: "melody-cassen",
    name: "Melody Cassen",
    role: "EUX Senior Product Designer at Lowe's Companies, Inc.",
    image: "/testimonials/Melody Cassen.jpeg",
    subject: "/testimonials/Melody Cassen-subject.png",
    testimonial:
      "Anthony is a joy to work with! Hard working, proactive and enterprising, he helped me on a variety of projects under tight deadlines and shifting priorities. His curiosity around emerging technologies keeps him on the forefront of what's new and how to leverage into his existing work flows.",
  },
  {
    slug: "lindsay-zierk",
    name: "Lindsay Zierk",
    role: "Head of UX & Product Strategy | IBM, Lowe's, Home Depot",
    image: "/testimonials/Lindsay Zierk.jpeg",
    subject: "/testimonials/Lindsay Zierk-subject.png",
    testimonial:
      "I've had the pleasure of working alongside Anthony and have always been impressed by his proactive nature. He has a natural hunger for learning (especially when it comes to the latest in AI) and he's even quicker to share that knowledge with others. Whenever a challenge arises, Anthony is there with a solution and a helping hand. He is a truly supportive and future-focused colleague!",
  },
];

/** O(n) lookup; n is small (4) so a Map isn't needed. */
export function getRecommendationBySlug(slug: string): Recommendation | undefined {
  return recommendations.find((r) => r.slug === slug);
}
