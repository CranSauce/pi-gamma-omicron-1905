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
  const publicRoutes = ["/", "/history", "/chapters", "/join", "/privacy"];
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

test("gives the private portal a distinct Mystery School passage", async () => {
  const [layout, intro, portal, css] = await Promise.all([
    readFile(new URL("../app/members/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/members/MemberPortalIntro.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/members/components/PortalShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /<MemberPortalIntro\s*\/>/);
  assert.match(intro, /^"use client";/);
  assert.match(intro, /pgo-mystery-school-entry-seen/);
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
