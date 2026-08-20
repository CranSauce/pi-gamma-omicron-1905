import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Pi Gamma Omicron Fraternity",
      template: "%s | Pi Gamma Omicron",
    },
    description:
      "The digital home and living archive of Pi Gamma Omicron Fraternity, founded in 1905.",
    icons: {
      icon: "/assets/brand/pi-gamma-omicron-crest.png",
      shortcut: "/assets/brand/pi-gamma-omicron-crest.png",
    },
    openGraph: {
      title: "Pi Gamma Omicron Fraternity",
      description: "Founded in 1905. Brotherhood · Scholarship · Integrity · Uplift.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Pi Gamma Omicron Fraternity — Founded 1905" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pi Gamma Omicron Fraternity",
      description: "Founded in 1905. Brotherhood · Scholarship · Integrity · Uplift.",
      images: [socialImage],
    },
  };
}

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
