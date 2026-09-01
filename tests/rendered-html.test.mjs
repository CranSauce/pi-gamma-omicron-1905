import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Pi Gamma Omicron legacy experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /class="legacy-experience"/);
  assert.match(html, /Darkness shall/);
  assert.match(html, /Born at Ohio State\./);
  assert.match(html, /For generations,/);
  assert.match(html, /1905 · 2026 · Beyond/);
  assert.match(html, /press-january-4-1906\.png/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps scroll motion progressive and accessible", async () => {
  const [component, css, page] = await Promise.all([
    readFile(new URL("../app/components/LegacyExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(component, /^"use client";/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /--legacy-progress/);
  assert.match(component, /--legacy-renewal-progress/);
  assert.match(component, /--legacy-future-progress/);
  assert.match(component, /data-intro-state="loading"/);
  assert.match(component, /legacy-intro-locked/);
  assert.match(component, /Skip intro/);
  assert.match(component, /aria-labelledby="legacy-experience-title"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@keyframes legacy-intro-ring-outer/);
  assert.match(css, /@keyframes legacy-intro-header/);
  assert.match(css, /\.legacy-experience\s*\{[\s\S]*height:\s*650svh/);
  assert.match(css, /var\(--legacy-renewal-progress\) \* 30deg/);
  assert.match(css, /var\(--legacy-future-progress\) \* 34deg/);
  assert.match(css, /\.legacy-experience__stage\s*\{[\s\S]*position:\s*sticky/);
  assert.match(css, /animation-timeline:\s*view\(\)/);
  assert.match(page, /<LegacyExperience\s*\/>/);
});

test("keeps every public and protected portal destination routed", async () => {
  const publicRoutes = [
    "/",
    "/about",
    "/history",
    "/founders",
    "/leadership",
    "/chapters",
    "/membership",
    "/news",
    "/contact",
    "/join",
    "/privacy",
  ];
  const protectedRouteFiles = [
    "../app/members/page.tsx",
    "../app/members/announcements/page.tsx",
    "../app/members/directory/page.tsx",
    "../app/members/discuss/page.tsx",
    "../app/members/discuss/[threadId]/page.tsx",
    "../app/members/admin/page.tsx",
  ];

  for (const pathname of publicRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} should render publicly`);
  }

  await Promise.all(protectedRouteFiles.map((pathname) => access(new URL(pathname, import.meta.url))));

  const portalSource = await readFile(new URL("../app/members/components/PortalShell.tsx", import.meta.url), "utf8");
  assert.match(portalSource, /href="\/members\/announcements"/);
  assert.match(portalSource, /href="\/members\/directory"/);
  assert.match(portalSource, /href="\/members\/discuss"/);
  assert.match(portalSource, /href="\/members\/admin"/);
});

test("surfaces every launch-phase public action and the confirmed 2027 conference", async () => {
  const [homeResponse, newsResponse, chrome, css] = await Promise.all([
    render("/"),
    render("/news"),
    readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  const home = await homeResponse.text();
  const news = await newsResponse.text();

  assert.match(home, /Learn our history/i);
  assert.match(home, /Membership/);
  assert.match(home, /Start a chapter/i);
  assert.match(news, /Charlotte/);
  assert.match(news, /Dates forthcoming/);
  assert.match(chrome, /href="\/about"/);
  assert.match(chrome, /href="\/contact"/);
  assert.match(css, /\.site-footer__crest img\s*\{[^}]*height:\s*clamp\(/);
  assert.match(css, /object-fit:\s*contain/);
});

test("gives the private portal a distinct Mystery School passage", async () => {
  const [overview, intro, portal, css] = await Promise.all([
    readFile(new URL("../app/members/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/members/MemberPortalIntro.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/members/components/PortalShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(overview, /<MemberPortalIntro\s*\/>/);
  assert.match(intro, /^"use client";/);
  assert.doesNotMatch(intro, /sessionStorage/);
  assert.match(intro, /prefers-reduced-motion:\s*reduce/);
  assert.match(intro, /Skip transition/);
  assert.match(intro, /mystery-school-of-pi\.png/);
  assert.match(portal, /portal-sidebar__mystery-mark/);
  assert.match(portal, /mystery-school-of-pi\.png/);
  assert.doesNotMatch(portal, /pi-gamma-omicron-crest\.png/);
  assert.match(css, /@keyframes member-gate-ring-outer/);
  assert.match(css, /@keyframes member-gate-seal/);
  assert.match(css, /html\.member-intro-locked/);
});

test("uses a private Supabase boundary for production portal data", async () => {
  const [migration, dataLayer, authLayer, interestRoute, memberResponse] = await Promise.all([
    readFile(new URL("../supabase/migrations/202608270001_portal_schema.sql", import.meta.url), "utf8"),
    readFile(new URL("../lib/portal-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/portal-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/interest/route.ts", import.meta.url), "utf8"),
    render("/members"),
  ]);

  assert.equal(memberResponse.status, 200);
  assert.match(await memberResponse.text(), /Continue with Google|sign-in is not ready/i);
  assert.match(migration, /alter table public\.interests enable row level security/i);
  assert.match(migration, /revoke all on table public\.members from anon, authenticated/i);
  assert.doesNotMatch(dataLayer, /cloudflare:workers|getDb|drizzle-orm/);
  assert.match(authLayer, /auth\.getUser\(\)/);
  assert.match(authLayer, /\/auth\/sign-in\?next=/);
  assert.match(interestRoute, /createInterest/);
  assert.doesNotMatch(interestRoute, /getDb|cloudflare:workers/);
});

test("publishes a canonical, machine-readable search and answer-engine layer", async () => {
  const [homeResponse, historyResponse, membersResponse, robotsResponse, sitemapResponse, manifestResponse, feedResponse, llmsResponse] = await Promise.all([
    render("/"),
    render("/history"),
    render("/members"),
    render("/robots.txt"),
    render("/sitemap.xml"),
    render("/manifest.webmanifest"),
    render("/feed.xml"),
    render("/llms.txt"),
  ]);

  const [home, history, members, robots, sitemap, manifest, feed, llms] = await Promise.all([
    homeResponse.text(),
    historyResponse.text(),
    membersResponse.text(),
    robotsResponse.text(),
    sitemapResponse.text(),
    manifestResponse.text(),
    feedResponse.text(),
    llmsResponse.text(),
  ]);

  assert.match(home, /<link rel="canonical" href="https:\/\/www\.pgo1905\.com"\s*\/?>/);
  assert.match(home, /Pi Gamma Omicron at a glance/);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /"@type":"Organization"/);
  assert.match(home, /"@type":"WebSite"/);
  assert.match(history, /<link rel="canonical" href="https:\/\/www\.pgo1905\.com\/history"\s*\/?>/);
  assert.match(history, /Ohio State University Archives/);
  assert.match(history, /among the earliest documented Black collegiate fraternities/);
  assert.match(history, /"citation":\["https:\/\/library\.osu\.edu/);
  assert.match(members, /<meta name="robots" content="noindex, nofollow"\s*\/?>/);
  assert.doesNotMatch(members, /rel="canonical"/);

  for (const html of [home, history]) {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length > 0);
    for (const [, json] of blocks) assert.doesNotThrow(() => JSON.parse(json));
  }

  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /Sitemap: https:\/\/www\.pgo1905\.com\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/api\//);
  assert.doesNotMatch(robots, /Disallow: \/members/);
  assert.equal(sitemapResponse.headers.get("content-type"), "application/xml");
  assert.match(sitemap, /<loc>https:\/\/www\.pgo1905\.com\/history<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/www\.pgo1905\.com\/founders<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/www\.pgo1905\.com\/join<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/(?:members(?:\/|<)|privacy(?:\/|<)|api\/)/);
  assert.match(manifestResponse.headers.get("content-type") ?? "", /^application\/manifest\+json/);
  assert.equal(JSON.parse(manifest).short_name, "ΠΓΟ");
  assert.match(feedResponse.headers.get("content-type") ?? "", /^application\/rss\+xml/);
  assert.match(feed, /Pi Gamma Omicron Fraternity News &amp; Events/);
  assert.match(llms, /Canonical website: https:\/\/www\.pgo1905\.com/);
  assert.match(llms, /Protected members-only content is private/);
});

test("publishes the eleven founders as a source-aware entity collection", async () => {
  const response = await render("/founders");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /The eleven who/);
  assert.match(html, /Leroy Barnett/);
  assert.match(html, /Elmer Shackelford/);
  assert.match(html, /first African American to earn its then-equivalent certificate of law/);
  assert.match(html, /Ohio State Archives research sheet/);
  assert.match(html, /"numberOfItems":11/);
  assert.match(html, /"@type":"Person"/);
});
