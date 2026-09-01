/* eslint-disable @next/next/no-img-element */
import { chapters, founders, leadership, pillars, publicUpdates, timeline } from "../lib/site-content";
import { createPageMetadata, organizationJsonLd, webPageJsonLd, websiteJsonLd } from "../lib/seo";
import { LegacyExperience } from "./components/LegacyExperience";
import { JsonLd } from "./components/Seo";
import { SiteFooter } from "./components/SiteChrome";

const description =
  "Pi Gamma Omicron is a historic Black collegiate fraternity founded by eleven Black students at The Ohio State University in 1905. Explore its history, chapters, membership, and renewal.";

export const metadata = createPageMetadata({
  title: "Historic Black Collegiate Fraternity Founded in 1905",
  description,
  path: "/",
});

export default function Home() {
  return (
    <main>
      <JsonLd data={[
        organizationJsonLd,
        websiteJsonLd,
        webPageJsonLd({ path: "/", title: "Pi Gamma Omicron Fraternity", description }),
      ]} />
      <LegacyExperience />

      <nav className="home-actions" aria-label="Explore Pi Gamma Omicron">
        <a href="/history"><span>01</span><strong>Learn our history</strong><small>Enter the archive</small></a>
        <a href="/membership"><span>02</span><strong>Membership</strong><small>Find your path</small></a>
        <a href="/join"><span>03</span><strong>Start a chapter</strong><small>Build what comes next</small></a>
      </nav>

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
          <a className="text-link" href="/history">Explore the complete history <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="entity-summary" aria-labelledby="entity-summary-title">
        <div className="entity-summary__heading">
          <p className="section-label">Pi Gamma Omicron at a glance</p>
          <h2 id="entity-summary-title">The essential record.</h2>
          <p>
            Concise answers to the most common questions about the fraternity, its founding, and its modern renewal.
          </p>
        </div>
        <dl>
          <div>
            <dt>What is Pi Gamma Omicron?</dt>
            <dd>A historic Black collegiate fraternity built around brotherhood, scholarship, integrity, and uplift.</dd>
          </div>
          <div>
            <dt>When and where was ΠΓΟ founded?</dt>
            <dd>January 1, 1905, at The Ohio State University in Columbus, Ohio.</dd>
          </div>
          <div>
            <dt>Who founded Pi Gamma Omicron?</dt>
            <dd>Eleven Black students whose names are preserved in fraternity records and Ohio State archival research.</dd>
          </div>
          <div>
            <dt>Is Pi Gamma Omicron active today?</dt>
            <dd>Yes. The fraternity entered a formal renewal in 2023 and is preserving its history while rebuilding chapters and national operations.</dd>
          </div>
        </dl>
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
          <a className="button button--paper" href="/history#archive">Enter the archive</a>
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
        <a className="text-link founders-section__link" href="/founders">Meet the eleven founders <span aria-hidden="true">↗</span></a>
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
          <a className="text-link text-link--light" href="/chapters">View chapters and expansion <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="leadership-section" aria-labelledby="leadership-title">
        <div className="section-heading">
          <p className="section-label">National leadership</p>
          <h2 id="leadership-title">Stewards of the renewal.</h2>
        </div>
        <div className="leadership-grid">
          {leadership.map((officer) => (
            <article key={officer.name}>
              <span>{officer.role}</span>
              <h3>{officer.name}</h3>
              <p>{officer.statement}</p>
            </article>
          ))}
        </div>
        <a className="text-link leadership-section__link" href="/leadership">Meet national leadership <span aria-hidden="true">↗</span></a>
      </section>

      <section className="home-news" aria-labelledby="home-news-title">
        <div>
          <p className="section-label">Upcoming · 2027</p>
          <h2 id="home-news-title">Charlotte is the next gathering place.</h2>
        </div>
        <article>
          <span>{publicUpdates[0].date}</span>
          <h3>{publicUpdates[0].title}</h3>
          <p>{publicUpdates[0].description}</p>
          <a className="button button--paper" href="/news#charlotte-2027">View conference announcement</a>
        </article>
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
          <a className="button button--scarlet" href="/join">Submit your interest</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
