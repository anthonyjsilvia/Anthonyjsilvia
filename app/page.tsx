"use client";

import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import AiAdvantage from "@/components/AiAdvantage";
import About from "@/components/About";
import Recommendations from "@/components/Recommendations";

/**
 * Home: recruiter screen → work proof → AI leverage → About → social proof.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <AiAdvantage />
      <About />
      <Recommendations />
    </>
  );
}
