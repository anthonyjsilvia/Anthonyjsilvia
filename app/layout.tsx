import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SiteChrome from "@/components/SiteChrome";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://anthonysilvia.com"),
  title: "Anthony Silvia - Product Experience Manager | UX, Engineering & Data Integration",
  description: "Product Experience Manager focused on UX, engineering, and data integration. Product Designer at Lowe's and Principal Consultant at NodeDa.",
  keywords: [
    "Product Experience Manager",
    "Product Designer",
    "Enterprise UX",
    "Operational Workflows",
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
    title: "Anthony Silvia - Product Experience Manager | UX, Engineering & Data Integration",
    description: "Product Experience Manager focused on UX, engineering, and data integration.",
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
    title: "Anthony Silvia - Product Experience Manager | UX, Engineering & Data Integration",
    description: "Product Experience Manager focused on UX, engineering, and data integration.",
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
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
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
