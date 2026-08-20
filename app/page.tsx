/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { chapters, founders, pillars, timeline } from "../lib/site-content";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const metadata = {
  title: "Founded 1905",
  description:
    "Founded at The Ohio State University in 1905. Discover the history, mission, pillars, chapters, and renewal of Pi Gamma Omicron Fraternity.",
};

export default function Home() {
  return (
    <main>
      <section className="legacy-hero" aria-labelledby="legacy-title">
        <div className="legacy-hero__atmosphere" aria-hidden="true" />
        <SiteHeader />

        <div className="legacy-hero__content">
          <p className="legacy-hero__kicker">The first chapter · Columbus, Ohio</p>
          <div className="legacy-hero__crest-wrap">
            <div className="legacy-hero__halo" aria-hidden="true" />
            <img
              className="legacy-hero__crest"
              src="/assets/brand/pi-gamma-omicron-crest.png"
              width={1024}
              height={1024}
              alt="The crest of Pi Gamma Omicron Fraternity"
            />
          </div>
          <div className="legacy-hero__title-lockup">
            <p>Founded Sunday, January 1</p>
            <h1 id="legacy-title">1905</h1>
            <p>The Ohio State University</p>
          </div>
        </div>

        <div className="legacy-hero__motto">
          <span className="legacy-hero__line" aria-hidden="true" />
          <p><em>Tenebrae Luci Locum Dabunt</em></p>
          <small>Darkness shall give way to light.</small>
        </div>
      </section>

      <section className="legacy-intro" id="legacy-begins" aria-labelledby="legacy-begins-title">
        <div>
          <p className="section-label">The surviving record begins</p>
          <h2 id="legacy-begins-title">Born in an age of exclusion.<br />Built for a future of uplift.</h2>
        </div>
        <div className="legacy-intro__copy">
          <p>
            In 1905, eleven Black students at The Ohio State University built an institution of their own—one grounded in scholarship, moral courage, and brotherhood.
          </p>
          <p>
            More than a century later, Pi Gamma Omicron is preserving that record and carrying its purpose forward.
          </p>
          <Link className="text-link" href="/history">Explore the complete history <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="mission-section" aria-labelledby="mission-title">
        <div className="mission-section__index">Mission / 1905</div>
        <blockquote id="mission-title">
          “Developing community through <em>brotherhood</em>, academic excellence, personal achievement, and service.”
        </blockquote>
        <p>
          Addressing historical racial injustice and promoting civic engagement.
        </p>
      </section>

      <section className="timeline-section" aria-labelledby="timeline-title">
        <div className="section-heading section-heading--light">
          <p className="section-label">The legacy in motion</p>
          <h2 id="timeline-title">A story still being recovered—and still being written.</h2>
        </div>
        <div className="timeline-preview">
          {timeline.map((event, index) => (
            <article className="timeline-preview__event" key={`${event.year}-${event.title}`}>
              <div className="timeline-preview__year"><span>{event.year}</span><small>{String(index + 1).padStart(2, "0")}</small></div>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <small>{event.source}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-feature" aria-labelledby="archive-title">
        <div className="archive-feature__image">
          <img
            src="/assets/archive/press-january-4-1906.png"
            width={1224}
            height={1211}
            loading="lazy"
            alt="January 4, 1906 newspaper clipping announcing Pi Gamma Omicron"
          />
        </div>
        <div className="archive-feature__copy">
          <p className="section-label">The record speaks · January 4, 1906</p>
          <h2 id="archive-title">A vision of national brotherhood.</h2>
          <p>
            A contemporary newspaper described Pi Gamma Omicron as an organization of eleven Black students with plans to carry its work to universities across the country.
          </p>
          <p className="archive-feature__note">
            Historical facsimile contains period racial terminology. It is preserved as part of the original record.
          </p>
          <Link className="button button--paper" href="/history#archive">Enter the archive</Link>
        </div>
      </section>

      <section className="pillars-section" id="pillars" aria-labelledby="pillars-title">
        <div className="section-heading">
          <p className="section-label">What carries us forward</p>
          <h2 id="pillars-title">Four pillars.<br />One enduring purpose.</h2>
        </div>
        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <article key={pillar.name}>
              <span>{pillar.number}</span>
              <h3>{pillar.name}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="founders-section" aria-labelledby="founders-title">
        <div className="founders-section__intro">
          <p className="section-label">The founding eleven</p>
          <h2 id="founders-title">Names recovered from the record.</h2>
          <p>
            Their full stories remain a work of historical recovery. Their names are preserved here as the foundation of the fraternity they created.
          </p>
        </div>
        <ol className="founders-list">
          {founders.map((founder, index) => (
            <li key={founder}><span>{String(index + 1).padStart(2, "0")}</span>{founder}</li>
          ))}
        </ol>
      </section>

      <section className="chapters-section" aria-labelledby="chapters-title">
        <div className="section-heading section-heading--light">
          <p className="section-label">The brotherhood today</p>
          <h2 id="chapters-title">From the founding chapter to the next.</h2>
        </div>
        <div className="chapter-cards">
          {chapters.map((chapter) => (
            <article key={chapter.name}>
              <div className="chapter-cards__letter" aria-hidden="true">{chapter.letters}</div>
              <div className="chapter-cards__content">
                <p>{chapter.designation}</p>
                <h3>{chapter.name}</h3>
                <strong>{chapter.location}</strong>
                <span>{chapter.institution}</span>
                <p>{chapter.statement}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="chapters-section__link">
          <Link className="text-link text-link--light" href="/chapters">View chapters and expansion <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="leadership-section" aria-labelledby="leadership-title">
        <div className="section-heading">
          <p className="section-label">National leadership</p>
          <h2 id="leadership-title">Stewards of the renewal.</h2>
        </div>
        <div className="leadership-grid">
          <article><span>President</span><h3>Zeke<br />Lipscomb</h3></article>
          <article><span>Vice President</span><h3>Kawame<br />Curry</h3></article>
        </div>
      </section>

      <section className="join-callout" aria-labelledby="join-callout-title">
        <div>
          <p className="section-label">The next chapter needs builders</p>
          <h2 id="join-callout-title">Become part of the legacy.</h2>
        </div>
        <div>
          <p>
            Tell us where you are, what you are building, and why the principles of Pi Gamma Omicron speak to you.
          </p>
          <Link className="button button--scarlet" href="/join">Submit your interest</Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
