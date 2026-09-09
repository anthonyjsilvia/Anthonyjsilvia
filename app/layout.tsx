import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://anthonysilvia.com"),
  title: "Anthony Silvia - Product Experience Manager | AI-Accelerated Product × UX",
  description:
    "Product Experience Manager who uses AI to raise efficiency and output across discovery, design exploration, and delivery - with product judgment owning what ships. Product Designer at Lowe's; Principal Consultant at NodeDa.",
  keywords: [
    "Product Experience Manager",
    "Product Manager",
    "UX Designer",
    "Product Designer",
    "AI Product Design",
    "AI-assisted UX",
    "Generative AI",
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
  ],
  authors: [{ name: "Anthony Silvia" }],
  creator: "Anthony Silvia",
  publisher: "Anthony Silvia",
  openGraph: {
    title: "Anthony Silvia - Product Experience Manager | AI-Accelerated Product × UX",
    description:
      "Product Experience Manager who uses AI to raise efficiency and output - discovery through delivery, with judgment owning what ships.",
    url: "https://anthonysilvia.com",
    siteName: "Anthony Silvia Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/homepage/ashero.PNG",
        width: 1200,
        height: 630,
        alt: "Anthony Silvia - Product Experience Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Silvia - Product Experience Manager | AI-Accelerated Product × UX",
    description:
      "Product Experience Manager who uses AI to raise efficiency and output - discovery through delivery, with judgment owning what ships.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://anthonysilvia.com" />
      </head>
      <body className="antialiased">
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
