import type { Metadata } from "next";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Anthony Silvia - Full-Stack Experience Manager | UX, Engineering & Data Integration",
  description: "Full-Stack Experience Manager focused on UX, engineering, and data integration. Associate Product Designer at Lowe's and Principal Consultant at NodeDa.",
  keywords: [
    "Full-Stack Experience Manager",
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
    title: "Anthony Silvia - Full-Stack Experience Manager | UX, Engineering & Data Integration",
    description: "Full-Stack Experience Manager focused on UX, engineering, and data integration.",
    url: "https://anthonysilvia.com",
    siteName: "Anthony Silvia Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://anthonysilvia.com/homepage/ashero.PNG",
        width: 1200,
        height: 630,
        alt: "Anthony Silvia - Full-Stack Experience Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Silvia - Full-Stack Experience Manager | UX, Engineering & Data Integration",
    description: "Full-Stack Experience Manager focused on UX, engineering, and data integration.",
    creator: "@anthonysilvia",
    images: ["https://anthonysilvia.com/homepage/ashero.PNG"],
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
        {children}
      </body>
    </html>
  );
}
