import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anthony Silvia - Experience Designer & Entrepreneur",
  description: "UX Designer and entrepreneur specializing in innovative, user-centric solutions. Associate Product Designer at Lowe's and Principal at NodeDa.",
  keywords: ["UX Designer", "Product Designer", "Entrepreneur", "Web Development", "User Experience"],
  authors: [{ name: "Anthony Silvia" }],
  openGraph: {
    title: "Anthony Silvia - Experience Designer & Entrepreneur",
    description: "UX Designer and entrepreneur specializing in innovative, user-centric solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}


