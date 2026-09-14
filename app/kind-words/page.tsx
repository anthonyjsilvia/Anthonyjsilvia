import type { Metadata } from "next";
import KindWordsApp from "@/components/KindWordsApp";

export const metadata: Metadata = {
  title: "Kind Words | Anthony Silvia, MBA",
  description:
    "Recommendations from leaders and peers who worked with Anthony Silvia.",
};

type PageProps = {
  searchParams: Promise<{ embed?: string }>;
};

/**
 * Kind Words page - AnthonyOS-styled recommendations browser.
 * Data comes from `lib/recommendations` (shared with homepage + detail routes).
 */
export default async function KindWordsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <KindWordsApp embedded={params.embed === "1"} />;
}
