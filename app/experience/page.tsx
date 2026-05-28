"use client";

import Experience from "@/components/Experience";
import Education from "@/components/Education";

/**
 * Experience route — pairs the work history (Experience) with credentials
 * (Education) since both are CV/career content. Page chrome (nav/footer/fab/
 * accessibility modal) is provided by `SiteChrome` in `app/layout.tsx`.
 */
export default function ExperiencePage() {
  return (
    <>
      <Experience />
      <Education />
    </>
  );
}
