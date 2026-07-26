"use client";

import SiteBackBar from "@/components/SiteBackBar";

/** @deprecated Prefer SiteBackBar — kept so existing imports keep working. */
export default function RecommendationBackBar() {
  return (
    <SiteBackBar href="/#recommendations" label="Back to recommendations" />
  );
}
