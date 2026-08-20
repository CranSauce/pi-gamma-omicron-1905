declare global {
  interface Window {
    __PGO_PAGES_DEMO__?: {
      basePath: string;
    };
  }
}

export function isPagesDemo() {
  return typeof window !== "undefined" && Boolean(window.__PGO_PAGES_DEMO__);
}

export function siteHref(path: string) {
  if (!isPagesDemo()) return path;
  if (path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("http")) return path;
  if (path.startsWith("#")) return `#/${path}`;
  return `#${path.startsWith("/") ? path : `/${path}`}`;
}

export function assetHref(path: string) {
  if (!isPagesDemo()) return path;
  const basePath = window.__PGO_PAGES_DEMO__?.basePath.replace(/\/$/, "") ?? "";
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
