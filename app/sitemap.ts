import type { MetadataRoute } from "next";
import { absoluteUrl } from "../lib/seo";

const lastModified = new Date("2026-09-01T00:00:00-04:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/history", changeFrequency: "monthly", priority: 0.95 },
    { path: "/about", changeFrequency: "monthly", priority: 0.85 },
    { path: "/membership", changeFrequency: "monthly", priority: 0.85 },
    { path: "/chapters", changeFrequency: "monthly", priority: 0.8 },
    { path: "/leadership", changeFrequency: "monthly", priority: 0.75 },
    { path: "/news", changeFrequency: "weekly", priority: 0.75 },
    { path: "/join", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  ] as const;

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
