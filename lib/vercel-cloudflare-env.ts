/**
 * Build-safe replacement for the Cloudflare Workers `env` module.
 * Vercel does not provide Cloudflare bindings; database-backed member routes
 * will surface their existing configuration error instead of failing to build.
 */
export const env: Record<string, unknown> = {};
