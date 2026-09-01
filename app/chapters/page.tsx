import { chapters, expansionDestinations } from "../../lib/site-content";
import { absoluteUrl, createPageMetadata, organizationId, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Explore Pi Gamma Omicron chapters at The Ohio State University and Kennesaw State University, plus information about starting or reactivating a chapter.";

export const metadata = createPageMetadata({
  title: "Chapters, Campus Expansion & Reactivation",
  description,
  path: "/chapters",
});

const chapterCollection = {
  ...webPageJsonLd({
    path: "/chapters",
    title: "Pi Gamma Omicron Chapters & Expansion",
    description,
    type: "CollectionPage",
  }),
  mainEntity: {
    "@type": "ItemList",
    itemListElement: chapters.map((chapter, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        "@id": `${absoluteUrl("/chapters")}#${chapter.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: `${chapter.name} of Pi Gamma Omicron Fraternity`,
        parentOrganization: { "@id": organizationId },
        location: {
          "@type": "Place",
          name: `${chapter.institution}, ${chapter.location}`,
        },
        description: chapter.statement,
      },
    })),
  },
};

export default function ChaptersPage() {
  return (
    <main className="interior interior--dark">
      <SiteHeader />
      <Breadcrumbs current="Chapters" path="/chapters" tone="dark" />
      <JsonLd data={chapterCollection} />
      <section className="interior-hero interior-hero--chapters">
        <p className="section-label">Chapters & expansion</p>
        <h1>From the first chapter<br />to the future.</h1>
        <p className="interior-hero__lede">
          Pi Gamma Omicron was imagined with national ambition. Its renewal carries that ambition forward with intention, honesty, and purpose.
        </p>
      </section>

      <section className="chapter-profiles" aria-label="Current fraternity chapters">
        {chapters.map((chapter, index) => (
          <article key={chapter.name}>
            <div className="chapter-profiles__map" aria-hidden="true">
              <span>{index === 0 ? "OH" : "GA"}</span>
              <i />
            </div>
            <div className="chapter-profiles__copy">
              <p>{chapter.designation}</p>
              <h2>{chapter.name}</h2>
              <strong>{chapter.location}</strong>
              <span>{chapter.institution}</span>
              <p>{chapter.statement}</p>
            </div>
          </article>
        ))}
        <p className="chapter-profiles__notice">
          Chapter affiliations reflect fraternity-provided records. Public university recognition documentation is being assembled separately.
        </p>
      </section>

      <section className="historic-expansion" aria-labelledby="historic-expansion-title">
        <div>
          <p className="section-label">The ambition of 1906</p>
          <h2 id="historic-expansion-title">A national vision from the beginning.</h2>
          <p>
            A surviving newspaper report said charters had been arranged for eight institutions. The article documents intent—not proof that each chapter was ultimately established.
          </p>
        </div>
        <ul>
          {expansionDestinations.map((destination, index) => (
            <li key={destination}><span>{String(index + 1).padStart(2, "0")}</span>{destination}</li>
          ))}
        </ul>
      </section>

      <section className="expansion-callout">
        <p>New chapters should begin with a shared commitment to scholarship, integrity, brotherhood, and meaningful community work.</p>
        <h2>Start or reactivate a chapter.</h2>
        <a className="button button--scarlet" href="/join#interest-form">Express chapter interest</a>
      </section>
      <SiteFooter />
    </main>
  );
}
