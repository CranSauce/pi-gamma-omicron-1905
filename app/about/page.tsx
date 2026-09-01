import { pillars } from "../../lib/site-content";
import { createPageMetadata, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Learn who Pi Gamma Omicron is, its mission, motto, founding purpose, and the principles guiding the renewal of this historic Black collegiate fraternity.";

export const metadata = createPageMetadata({
  title: "About Pi Gamma Omicron",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <Breadcrumbs current="About" path="/about" />
      <JsonLd data={webPageJsonLd({ path: "/about", title: "About Pi Gamma Omicron", description, type: "AboutPage" })} />
      <section className="interior-hero interior-hero--about">
        <p className="section-label">About Pi Gamma Omicron</p>
        <h1>Rooted in history.<br />Rebuilt for what comes next.</h1>
        <p className="interior-hero__lede">
          Founded by eleven Black students at The Ohio State University in 1905, Pi Gamma Omicron is renewing a brotherhood built around achievement, service, and collective progress.
        </p>
      </section>

      <section className="about-manifesto" aria-labelledby="about-mission-title">
        <div>
          <p className="section-label">Who we are</p>
          <h2 id="about-mission-title">A historic fraternity with living work to do.</h2>
        </div>
        <div className="about-manifesto__copy">
          <p>
            Pi Gamma Omicron began in an era when Black students were denied equal access to many parts of collegiate life. Its founders answered exclusion by building community, intellectual fellowship, and an institution of their own.
          </p>
          <p>
            Today’s renewal honors that beginning through careful historical preservation, strong chapters, meaningful service, and a members’ community equipped to carry the work forward.
          </p>
          <a className="text-link" href="/history">Read the documented history <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="mission-ledger" aria-labelledby="mission-ledger-title">
        <p className="section-label">Our mission</p>
        <blockquote id="mission-ledger-title">
          Developing community through brotherhood, academic excellence, personal achievement, and service to our community, addressing historical racial injustice and promoting civic engagement.
        </blockquote>
        <div className="mission-ledger__meta">
          <span>Founded January 1, 1905</span>
          <span>Columbus, Ohio</span>
          <span>Tenebrae Luci Locum Dabunt</span>
        </div>
      </section>

      <section className="principles-ledger" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="section-label">Fraternity principles</p>
          <h2 id="principles-title">The standard behind the name.</h2>
        </div>
        <div className="principles-ledger__grid">
          {pillars.map((pillar) => (
            <article key={pillar.name}>
              <span>{pillar.number}</span>
              <h3>{pillar.name}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="renewal-callout">
        <p className="section-label">The purpose in practice</p>
        <h2>Preserve the record.<br />Strengthen the brotherhood.<br />Build what lasts.</h2>
        <p>
          The public story will continue to grow as fraternity leadership confirms new records, programs, and milestones. Protected fraternal traditions remain within the members-only experience.
        </p>
        <a className="button button--scarlet" href="/membership">Explore membership</a>
      </section>
      <SiteFooter />
    </main>
  );
}
