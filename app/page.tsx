"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Recommendations from "@/components/Recommendations";

/**
 * Home page: the personality landing. Detailed sections (Experience, Portfolio,
 * Evidence, Resume, Contact) each live on their own route now — the chrome
 * (nav, footer, FAB, accessibility modal, skip links) is provided by
 * `SiteChrome` via `app/layout.tsx`, so this file only declares page content.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Recommendations />
    </>
  );
}
