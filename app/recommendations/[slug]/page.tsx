import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Quote } from "lucide-react";
import {
  recommendations,
  getRecommendationBySlug,
} from "@/lib/recommendations";

/**
 * Recommendation detail page — `/recommendations/<slug>`.
 *
 * Replaces the previous in-page modal. Each testimonial gets its own
 * canonical, shareable URL plus full SEO metadata and an Open Graph card.
 *
 * This is a server component:
 *   • Data lookup happens at build/request time.
 *   • Static params are pre-rendered (see `generateStaticParams`), so
 *     every known recommendation ships as a static HTML page.
 *   • Page chrome (nav, footer, FAB, accessibility modal, the
 *     `.apple-reveal` entrance animation) is provided by `SiteChrome`
 *     in `app/layout.tsx` — this page only declares its content.
 */

type PageProps = {
  /** Next.js 16: `params` is a Promise that must be awaited. */
  params: Promise<{ slug: string }>;
};

/**
 * Pre-render every known recommendation as a static page. New entries
 * added to `lib/recommendations.ts` are picked up automatically on the
 * next build.
 */
export function generateStaticParams() {
  return recommendations.map((r) => ({ slug: r.slug }));
}

/**
 * Per-page metadata — title, meta description, and OG card with the
 * portrait so individual recommendation URLs preview nicely when shared
 * on Slack, LinkedIn, iMessage, etc.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rec = getRecommendationBySlug(slug);
  if (!rec) {
    return {
      title: "Recommendation not found",
      description: "We couldn't find that recommendation.",
    };
  }

  // First paragraph of the testimonial, trimmed to a reasonable description length.
  const firstPara = rec.testimonial.split("\n\n")[0] ?? rec.testimonial;
  const description =
    firstPara.length > 200 ? `${firstPara.slice(0, 197).trimEnd()}…` : firstPara;

  return {
    title: `${rec.name} on Anthony Silvia`,
    description,
    openGraph: {
      title: `${rec.name} on Anthony Silvia`,
      description,
      type: "article",
      images: [
        {
          url: rec.image,
          width: 1200,
          height: 1200,
          alt: `Portrait of ${rec.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${rec.name} on Anthony Silvia`,
      description,
      images: [rec.image],
    },
  };
}

export default async function RecommendationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const rec = getRecommendationBySlug(slug);
  if (!rec) notFound();

  return (
    <article className="min-h-screen pt-24 md:pt-32 pb-24 md:pb-32 bg-white dark:bg-black">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top "back" link — quiet, sits above the editorial header. */}
        <Link
          href="/#recommendations"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 rounded transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to recommendations</span>
        </Link>

        {/* Hero portrait — centered editorial card. */}
        <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/10 mt-10 mb-10">
          <Image
            src={rec.image}
            alt={`Portrait of ${rec.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover"
            priority
          />
        </div>

        {/* Name + role with a centered gradient accent rule. */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-3">
            {rec.name}
          </h1>
          <p className="text-[11px] md:text-xs uppercase tracking-[0.16em] font-semibold text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)] px-4">
            {rec.role}
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
          />
        </header>

        {/* Testimonial body with large faded quote-glyph decoration. */}
        <div className="relative px-2 md:px-0">
          <Quote
            className="absolute -top-2 -left-2 md:-top-6 md:-left-12 h-20 w-20 md:h-28 md:w-28 text-[var(--primary)] opacity-[0.08] pointer-events-none select-none"
            strokeWidth={1.4}
            aria-hidden="true"
          />
          <div className="relative text-[17px] md:text-lg text-[var(--text-secondary)] dark:text-[var(--text-secondary)] leading-[1.78] whitespace-pre-line">
            {rec.testimonial}
          </div>
        </div>

        {/* Bottom action — proper "back" button so visitors who scroll all
            the way through have a clear way back without scrolling up. */}
        <div className="mt-16 pt-10 border-t border-black/[0.08] dark:border-white/10 flex justify-center">
          <Link
            href="/#recommendations"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to recommendations</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
