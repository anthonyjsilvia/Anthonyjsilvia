"use client";

import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Recommendations from "@/components/Recommendations";

/**
 * Home: hero → selected work → about → recommendations.
 * Full recommendation set lives on /recommendations.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Recommendations />
    </>
  );
}
