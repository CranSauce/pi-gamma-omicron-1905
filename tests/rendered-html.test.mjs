import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(component, /aria-labelledby="legacy-experience-title"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.legacy-experience\s*\{[\s\S]*height:\s*600svh/);
  assert.match(css, /\.legacy-experience__stage\s*\{[\s\S]*position:\s*sticky/);
  assert.match(css, /animation-timeline:\s*view\(\)/);
  assert.match(page, /<LegacyExperience\s*\/>/);
});
