import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * 404 fallback for `/recommendations/<unknown-slug>`. Next.js routes here
 * automatically when the dynamic page component calls `notFound()`.
 */
export default function RecommendationNotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="text-center max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)] mb-3">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.015em] text-[var(--text-primary)] mb-4">
          Recommendation not found
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
          We couldn&rsquo;t find that recommendation. It may have been moved or the
          link may be slightly off.
        </p>
        <Link
          href="/#recommendations"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to all recommendations</span>
        </Link>
      </div>
    </section>
  );
}
