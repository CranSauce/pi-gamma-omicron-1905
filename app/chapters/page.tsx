import { chapters, expansionDestinations } from "../../lib/site-content";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata = {
  title: "Chapters & Expansion",
  description:
    "Meet the Alpha and Beta chapters of Pi Gamma Omicron and explore the fraternity’s renewal-era expansion vision.",
  openGraph: {
    title: "Chapters & Expansion | Pi Gamma Omicron",
    description: "From Columbus to Kennesaw—and toward the fraternity’s next chapter.",
    images: [],
  },
  twitter: {
    title: "Chapters & Expansion | Pi Gamma Omicron",
    description: "From Columbus to Kennesaw—and toward the fraternity’s next chapter.",
    images: [],
  },
};

export default function ChaptersPage() {
  return (
    <main className="interior interior--dark">
      <SiteHeader />
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
        <h2>Build the next chapter.</h2>
        <a className="button button--scarlet" href="/join">Express chapter interest</a>
      </section>
      <SiteFooter />
    </main>
  );
}
