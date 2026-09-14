/**
 * Client-side platform helpers for AnthonyOS surface styling.
 * Apple (macOS / iOS / iPadOS) keeps glass; everything else uses Material.
 */

type NavigatorWithUAData = Navigator & {
  userAgentData?: { platform?: string };
};

function readPlatformSignals(): { ua: string; platform: string } {
  if (typeof navigator === "undefined") {
    return { ua: "", platform: "" };
  }
  const nav = navigator as NavigatorWithUAData;
  return {
    ua: nav.userAgent || "",
    platform: nav.userAgentData?.platform || nav.platform || "",
  };
}

/** True for macOS, iOS, and iPadOS (including iPad desktop UA). */
export function isApplePlatform(): boolean {
  const { ua, platform } = readPlatformSignals();
  if (!ua && !platform) return false;

  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  if (/iPhone|iPad|iPod/i.test(platform)) return true;
  if (/macOS/i.test(platform) || /^Mac/i.test(platform)) return true;
  // Desktop Safari on Mac, and iPadOS “Request Desktop Website”
  if (/Macintosh|Mac OS X|MacIntel/i.test(ua)) return true;

  return false;
}

export type OsSurfaceStyle = "apple" | "material";

export function getOsSurfaceStyle(): OsSurfaceStyle {
  return isApplePlatform() ? "apple" : "material";
}
