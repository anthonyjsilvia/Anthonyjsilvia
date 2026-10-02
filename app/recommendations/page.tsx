import type { Metadata } from "next";
import Recommendations from "@/components/Recommendations";

export const metadata: Metadata = {
  title: "Recommendations | Anthony Silvia, MBA",
  description:
    "Recommendations from leaders and peers who worked with Anthony Silvia.",
};

/**
 * Recommendations index — the recruiter-facing destination for social proof.
 * Individual quotes live at `/recommendations/<slug>`.
 */
export default function RecommendationsPage() {
  return (
    <article className="min-h-screen pb-8 md:pb-12">
      {/* Clear fixed Menu cluster */}
      <div className="h-[4.75rem]" aria-hidden="true" />
      <Recommendations asPage />
    </article>
  );
}
