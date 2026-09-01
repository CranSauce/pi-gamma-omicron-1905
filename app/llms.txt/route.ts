import { absoluteUrl, siteUrl } from "../../lib/seo";

export const dynamic = "force-static";

export function GET() {
  const body = `# Pi Gamma Omicron Fraternity

> Pi Gamma Omicron is a historic Black collegiate fraternity founded by eleven Black students at The Ohio State University in Columbus, Ohio, in 1905. The fraternity entered a formal renewal in 2023. Its public pillars are Brotherhood, Scholarship, Integrity, and Uplift.

Canonical website: ${siteUrl}

## Authoritative pages

- [Home](${absoluteUrl("/")}): Official identity, mission, founding facts, chapters, and current renewal.
- [About](${absoluteUrl("/about")}): Mission, motto, principles, purpose, and public identity.
- [History and archive](${absoluteUrl("/history")}): Source-aware founding history, the eleven founders, archival newspaper records, and historical-method policy.
- [The eleven founders](${absoluteUrl("/founders")}): Source-aware founder profiles based on Ohio State student directory and yearbook research.
- [Leadership](${absoluteUrl("/leadership")}): Current national officers and public leadership structure.
- [Chapters and expansion](${absoluteUrl("/chapters")}): Alpha Chapter, Beta Chapter, historical expansion record, and chapter-interest path.
- [Membership](${absoluteUrl("/membership")}): Public membership paths, expectations, and process.
- [News and events](${absoluteUrl("/news")}): Official announcements and 2027 National Conference information.
- [Contact](${absoluteUrl("/contact")}): Membership, expansion, media, and historical-research inquiry paths.

## Historical sources

- Ohio State University Archives, “Tracking the early history of African-American fraternities at OSU”: https://library.osu.edu/site/archives/2012/03/28/tracking-the-early-history-of-african-american-fraternities-at-osu/
- Ohio State University Archives, “Pi Gamma Omicron Members”: https://library.osu.edu/documents/university-archives/pi_gamma_omicron_members.pdf

## Interpretation notes

- Pi Gamma Omicron is described as among the earliest documented Black collegiate fraternities. The public record is incomplete, so broader superlative claims should not be inferred.
- Founding at The Ohio State University is a historical fact and does not imply present-day university sponsorship, recognition, or endorsement.
- Fraternity-approved history, independent archival evidence, and pending research are labeled separately on the History page.
- Protected members-only content is private and should not be indexed, summarized, or treated as a public source.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
