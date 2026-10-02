import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SiteChrome from "@/components/SiteChrome";

/** Clean geometric for large headlines only, open shapes, easier than Syne. */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

/** High-legibility UI + body face, generous x-height, open apertures. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://anthonysilvia.com"),
  title: "Anthony Silvia, MBA · Product Designer | Ops UX × Systems × AI Practice",
  description:
    "Anthony Silvia, MBA · Product Designer who turns complex operational workflows into clear product experiences. Research, systems thinking, and AI-assisted practice with judgment owning what ships. Product Designer at Lowe's; Principal Consultant at NodeDa.",
  keywords: [
    "Anthony Silvia MBA",
    "MBA",
    "Master of Business Administration",
    "Product Designer",
    "UX Designer",
    "Product Design",
    "AI Product Design",
    "AI-assisted UX",
    "Enterprise UX",
    "Operational Workflows",
    "Discovery",
    "Prioritization",
    "Usability Testing",
    "Accessible Systems",
    "WCAG 2.2",
    "UX Design",
    "User Experience",
    "Accessibility",
    "Design Systems",
    "Figma",
    "Anthony Silvia",
    "Lowe's",
    "NodeDa",
    "Southern New Hampshire University",
  ],
  authors: [{ name: "Anthony Silvia" }],
  creator: "Anthony Silvia",
  publisher: "Anthony Silvia",
  openGraph: {
    title: "Anthony Silvia, MBA · Product Designer",
    description:
      "Product Designer who turns complex operational workflows into clear product experiences. Research, systems, and AI practice with judgment owning what ships. MBA pending conferral (SNHU).",
    url: "https://anthonysilvia.com",
    siteName: "Anthony Silvia Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/homepage/ashero.PNG",
        width: 1200,
        height: 630,
        alt: "Anthony Silvia, MBA · Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Silvia, MBA · Product Designer",
    description:
      "Product Designer who turns complex operational workflows into clear product experiences, with AI practice and judgment owning what ships.",
    creator: "@anthonysilvia",
    images: ["/homepage/ashero.PNG"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes if needed
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${jakarta.variable}`}>
      <head>
        <link rel="canonical" href="https://anthonysilvia.com" />
      </head>
      <body className="antialiased font-sans">
        <AnalyticsProvider />
        <Script
          id="nrova-behavior-tracker"
          src="https://us-central1-nrovallc.cloudfunctions.net/behaviorApi/behavior-tracker.js"
          strategy="afterInteractive"
          data-org="DmByfTTUdCs0ecp2MMoQ"
          data-key="nrov_live_c277a0b049cdfe4daf41ec0a2000961f55dd0039f80d468fa7a0baf13ad97c91"
          data-api-base="https://us-central1-nrovallc.cloudfunctions.net/behaviorApi"
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
