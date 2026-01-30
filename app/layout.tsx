import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anthony Silvia - Product Designer | Enterprise UX, Operational Workflows & Accessible Systems",
  description: "Product Designer focused on building scalable, accessible enterprise systems grounded in real-world workflows and operational constraints. Associate Product Designer at Lowe's and Principal Consultant at NodeDa.",
  keywords: [
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
    title: "Anthony Silvia - Product Designer | Enterprise UX, Operational Workflows & Accessible Systems",
    description: "Product Designer focused on building scalable, accessible enterprise systems grounded in real-world workflows and operational constraints.",
    url: "https://anthonyjsilvia.com",
    siteName: "Anthony Silvia Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg", // You can add an OG image later
        width: 1200,
        height: 630,
        alt: "Anthony Silvia - Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Silvia - Product Designer | Enterprise UX, Operational Workflows & Accessible Systems",
    description: "Product Designer focused on building scalable, accessible enterprise systems grounded in real-world workflows and operational constraints.",
    creator: "@anthonyjsilvia", // Update if you have a Twitter handle
    images: ["/og-image.jpg"], // You can add a Twitter image later
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
        <link rel="canonical" href="https://anthonyjsilvia.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
