"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getFirebaseAnalytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

/**
 * Initializes Firebase Analytics (Google Analytics) and logs page_view
 * for the current route. Runs on all pages site-wide.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const initAndLog = async () => {
      try {
        const analytics = await getFirebaseAnalytics();
        if (!mounted || !analytics) return;

        const pagePath = pathname || window.location.pathname || "/";
        const fullPath = window.location.hash
          ? `${pagePath}${window.location.hash}`
          : pagePath;

        logEvent(analytics, "page_view", {
          page_path: fullPath,
          page_title: typeof document !== "undefined" ? document.title : "",
        });
      } catch {
        // Analytics is optional; fail silently
      }
    };

    initAndLog();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  return null;
}
