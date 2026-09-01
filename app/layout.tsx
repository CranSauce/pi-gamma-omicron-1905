import type { Metadata, Viewport } from "next";
import { absoluteUrl, defaultDescription, siteName, siteUrl } from "../lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} | Founded 1905`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  category: "Fraternal organization",
  creator: siteName,
  publisher: siteName,
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: "/assets/brand/pi-gamma-omicron-crest.png",
    shortcut: "/assets/brand/pi-gamma-omicron-crest.png",
    apple: "/assets/brand/pi-gamma-omicron-crest.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  openGraph: {
    title: `${siteName} | Founded 1905`,
    description: defaultDescription,
    siteName,
    locale: "en_US",
    type: "website",
    images: [{
      url: absoluteUrl("/og.png"),
      width: 1536,
      height: 1024,
      alt: "Pi Gamma Omicron Fraternity — Founded 1905",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Founded 1905`,
    description: defaultDescription,
    images: [absoluteUrl("/og.png")],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eee9df" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
