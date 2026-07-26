import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";
import {
  recommendations,
  getRecommendationBySlug,
} from "@/lib/recommendations";
import RecommendationBackBar from "@/components/RecommendationBackBar";

/**
 * Recommendation detail page - `/recommendations/<slug>`.
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
 *     in `app/layout.tsx` - this page only declares its content.
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
 * Per-page metadata - title, meta description, and OG card with the
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
    <article className="min-h-screen bg-white pb-24 dark:bg-black md:pb-32">
      <RecommendationBackBar />
      {/* Clear the fixed top controls (Menu + Back share this band). */}
      <div className="h-[4.75rem]" aria-hidden="true" />

      <div className="mx-auto mt-6 w-full max-w-[var(--hp-cine-max)] px-[var(--hp-cine-pad,1.25rem)] md:mt-10">
        {/* Wide editorial split: portrait + quote share the viewport. */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:gap-16 xl:gap-20">
          <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-[clamp(16px,2vw,28px)] border border-black/[0.08] dark:border-white/10 lg:mx-0 lg:max-w-none lg:sticky lg:top-[4.75rem]">
            <Image
              src={rec.image}
              alt={`Portrait of ${rec.name}`}
              fill
              sizes="(max-width: 1023px) 90vw, 42vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <header className="mb-8 md:mb-10">
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold tracking-[-0.045em] leading-[1.05] text-[var(--text-primary)]">
                {rec.name}
              </h1>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)] md:text-xs">
                {rec.role}
              </p>
              <div
                aria-hidden="true"
                className="mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent"
              />
            </header>

            <div className="relative">
              <Quote
                className="pointer-events-none absolute -left-1 -top-2 h-16 w-16 select-none text-[var(--primary)] opacity-[0.1] md:-left-4 md:-top-4 md:h-24 md:w-24"
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <div className="relative text-[1.05rem] leading-[1.78] text-[var(--text-secondary)] whitespace-pre-line md:text-[1.15rem] md:leading-[1.8]">
                {rec.testimonial}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
