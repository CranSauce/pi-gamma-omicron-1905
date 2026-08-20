/* eslint-disable @next/next/no-img-element */
import { founders, timeline } from "../../lib/site-content";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata = {
  title: "History & Archive",
  description:
    "Explore the source-aware history, founding members, surviving press record, archival gaps, and renewal of Pi Gamma Omicron Fraternity.",
  openGraph: {
    title: "History & Archive | Pi Gamma Omicron",
    description: "The surviving record of Pi Gamma Omicron, from 1905 to the present renewal.",
    images: [],
  },
  twitter: {
    title: "History & Archive | Pi Gamma Omicron",
    description: "The surviving record of Pi Gamma Omicron, from 1905 to the present renewal.",
    images: [],
  },
};

export default function HistoryPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <section className="interior-hero interior-hero--history">
        <p className="section-label">History & archive</p>
        <h1>A history recovered<br />from the quiet.</h1>
        <div className="interior-hero__meta">
          <p>Founded Sunday, January 1, 1905</p>
          <p>Columbus, Ohio</p>
          <p>Eleven founding members</p>
        </div>
      </section>

      <section className="history-statement">
        <p className="history-statement__lead">
          Pi Gamma Omicron emerged when Black students were denied full participation in the collegiate institutions around them.
        </p>
        <div>
          <p>
            The fraternity’s approved founding record places its beginning at The Ohio State University on January 1, 1905. Contemporary reporting surviving from 1906 documents an organization of eleven Black students with national ambitions.
          </p>
          <p>
            The historical archive remains incomplete. This site distinguishes fraternity-approved history from contemporary evidence and from questions that still require research. Where the record is silent, we say so.
          </p>
        </div>
      </section>

      <section className="history-timeline" aria-labelledby="history-timeline-title">
        <div className="history-timeline__heading">
          <p className="section-label">The documented path</p>
          <h2 id="history-timeline-title">1905 — 2026</h2>
        </div>
        <div className="history-timeline__events">
          {timeline.map((event) => (
            <article key={`${event.year}-${event.title}`}>
              <time>{event.year}</time>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <small>{event.source}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-room" id="archive" aria-labelledby="archive-room-title">
        <div className="archive-room__heading">
          <p className="section-label">The press record</p>
          <h2 id="archive-room-title">The record speaks in its own voice.</h2>
          <p>
            These facsimiles preserve original language from the period, including terminology now recognized as offensive. They are shown for historical accuracy and context.
          </p>
        </div>
        <div className="archive-grid">
          <figure className="archive-grid__feature">
            <img src="/assets/archive/press-january-4-1906.png" width={1224} height={1211} loading="lazy" alt="1906 newspaper clipping announcing a chapter of Pi Gamma Omicron in Ohio" />
            <figcaption>
              <strong>“Chapter of Pi Gamma Omicron Organized in Ohio”</strong>
              <span><em>Champaign Daily Gazette</em> · January 4, 1906</span>
              <p>Identified source. The article reports eleven students and proposed charters at eight institutions.</p>
            </figcaption>
          </figure>
          <figure>
            <img src="/assets/archive/press-january-3.png" width={1224} height={625} loading="lazy" alt="Early newspaper announcement of Pi Gamma Omicron" />
            <figcaption>
              <strong>“Colored Greek Letter Fraternity”</strong>
              <span>Dated January 3 · publication and year under verification</span>
              <p>Appears to be a syndicated version of the same early announcement rather than an independent account.</p>
            </figcaption>
          </figure>
          <figure>
            <img src="/assets/archive/incorporation-october-17.png" width={1224} height={970} loading="lazy" alt="Newspaper clipping reporting the incorporation of Pi Gamma Omicron" />
            <figcaption>
              <strong>“Colored Men Form ‘Frat’”</strong>
              <span>Dated October 17 · publication and year under verification</span>
              <p>Reports incorporation and quotes a charter purpose focused on social, moral, and intellectual advancement.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="founders-archive" aria-labelledby="founders-archive-title">
        <div>
          <p className="section-label">Founders</p>
          <h2 id="founders-archive-title">The founding eleven.</h2>
          <p>
            Their names are supported by fraternity records and Ohio State archival research. Biographical recovery remains ongoing.
          </p>
        </div>
        <ol>
          {founders.map((founder, index) => (
            <li key={founder}><span>{String(index + 1).padStart(2, "0")}</span><strong>{founder}</strong></li>
          ))}
        </ol>
      </section>

      <section className="source-policy">
        <div>
          <p className="section-label">Our historical standard</p>
          <h2>Source before story.</h2>
        </div>
        <div>
          <p><strong>Archival fact</strong> is supported by a primary record or institutional archive.</p>
          <p><strong>Official fraternity record</strong> is supplied and approved by fraternity leadership.</p>
          <p><strong>Pending verification</strong> remains clearly labeled and is never presented as settled fact.</p>
          <a className="text-link" href="/join">Help carry the legacy forward <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
