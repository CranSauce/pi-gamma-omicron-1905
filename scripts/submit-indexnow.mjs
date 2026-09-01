const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.pgo1905.com").replace(/\/$/, "");
const host = new URL(siteUrl).host;
const key = "b51c62bd83e84658a9c80fe7dc3d49b1";
const paths = ["/", "/about", "/history", "/founders", "/leadership", "/chapters", "/membership", "/news", "/contact", "/join"];

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList: paths.map((path) => `${siteUrl}${path}`),
  }),
});

if (!response.ok && response.status !== 202) {
  throw new Error(`IndexNow submission failed with ${response.status}: ${await response.text()}`);
}

console.log(`Submitted ${paths.length} public URLs for ${host} to IndexNow (${response.status}).`);
