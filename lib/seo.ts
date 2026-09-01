import type { Metadata } from "next";

const fallbackSiteUrl = "https://pgo1905.com";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) return fallbackSiteUrl;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL,
);

export const siteName = "Pi Gamma Omicron Fraternity";
export const shortSiteName = "Pi Gamma Omicron";
export const defaultDescription =
  "The official digital home and living archive of Pi Gamma Omicron Fraternity, founded by eleven Black students at The Ohio State University in 1905.";
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteUrl}/`).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/og.png",
  type = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const images = image
    ? [{ url: absoluteUrl(image), width: 1536, height: 1024, alt: `${shortSiteName} — Founded 1905` }]
    : [];

  return {
    title,
    description,
    alternates: noIndex ? undefined : { canonical },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: "en_US",
      type,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: images.map(({ url }) => url),
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteName,
  alternateName: [shortSiteName, "ΠΓΟ", "PGO"],
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/assets/brand/pi-gamma-omicron-crest.png"),
    width: 1024,
    height: 1024,
  },
  image: absoluteUrl("/og.png"),
  description: defaultDescription,
  foundingDate: "1905-01-01",
  foundingLocation: {
    "@type": "Place",
    name: "The Ohio State University, Columbus, Ohio",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Columbus",
      addressRegion: "OH",
      addressCountry: "US",
    },
  },
  slogan: "Tenebrae Luci Locum Dabunt",
  areaServed: "United States",
  knowsAbout: [
    "Black collegiate fraternity history",
    "Brotherhood",
    "Scholarship",
    "Community service",
    "Civic engagement",
    "Historical preservation",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  url: siteUrl,
  name: siteName,
  alternateName: [shortSiteName, "ΠΓΟ"],
  description: defaultDescription,
  inLanguage: "en-US",
  publisher: { "@id": organizationId },
};

export function webPageJsonLd({
  path,
  title,
  description,
  type = "WebPage",
  dateModified = "2026-09-01",
}: {
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage" | "Article";
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    headline: type === "Article" ? title : undefined,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    publisher: type === "Article" ? { "@id": organizationId } : undefined,
    dateModified,
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
