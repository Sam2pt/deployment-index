import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 16-bit display face — used ONLY for big arcade moments: titles, HUD labels,
// scores, class names, buttons. Never for prose.
const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

// Clean, highly readable sans for everything you actually read: prompts,
// answer options, taglines, the breakdown. The pixel chrome, sprites, neon,
// and scanlines carry the 16-bit feel; this just makes reading effortless.
const geistSans = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deploymentindex.2pt.ai"),
  title: "The Deployment Index: Which AI marketing leader are you?",
  description:
    "Find out in 60 seconds. Five archetypes. One industry ranking. Built by 2PT, the deployment firm for marketing.",
  openGraph: {
    title: "The Deployment Index",
    description: "Which AI marketing leader are you? Find out in 60 seconds.",
    url: "https://deploymentindex.2pt.ai",
    siteName: "The Deployment Index",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Deployment Index",
    description: "Which AI marketing leader are you? Find out in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${pressStart.variable} ${geistSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
