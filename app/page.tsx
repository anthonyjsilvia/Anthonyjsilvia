"use client";

import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Recommendations from "@/components/Recommendations";

/**
 * Home: hero → portfolio → recommendations.
 * About lives at /about. Case studies stay at /portfolio/*.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <Recommendations />
    </>
  );
}
