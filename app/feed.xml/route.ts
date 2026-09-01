import { publicUpdates } from "../../lib/site-content";
import { absoluteUrl, defaultDescription, siteName } from "../../lib/seo";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = publicUpdates.map((update) => {
    const url = absoluteUrl(update.href);
    return `
      <item>
        <title>${escapeXml(update.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid isPermaLink="true">${escapeXml(url)}</guid>
        <category>${escapeXml(update.type)}</category>
        <description>${escapeXml(update.description)}</description>
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escapeXml(`${siteName} News & Events`)}</title>
        <link>${escapeXml(absoluteUrl("/news"))}</link>
        <description>${escapeXml(defaultDescription)}</description>
        <language>en-us</language>
        <lastBuildDate>Tue, 01 Sep 2026 04:00:00 GMT</lastBuildDate>
        <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
