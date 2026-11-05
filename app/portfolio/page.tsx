"use client";

import { useEffect } from "react";

/** Fallback if the /portfolio redirect is not applied. Portfolio lives on the homepage. */
export default function PortfolioPage() {
  useEffect(() => {
    window.location.replace("/#portfolio");
  }, []);

  return null;
}
