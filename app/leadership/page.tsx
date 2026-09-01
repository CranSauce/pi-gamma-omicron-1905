import { leadership } from "../../lib/site-content";
import { absoluteUrl, createPageMetadata, organizationId, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Meet President Zeke Lipscomb, Vice President Kawame Curry, and the national leadership stewarding the renewal of Pi Gamma Omicron Fraternity.";

export const metadata = createPageMetadata({
  title: "National Leadership",
  description,
  path: "/leadership",
});

const leadershipPage = {
  ...webPageJsonLd({ path: "/leadership", title: "Pi Gamma Omicron National Leadership", description, type: "AboutPage" }),
  mainEntity: leadership.map((officer) => ({
    "@type": "Person",
    "@id": `${absoluteUrl("/leadership")}#${officer.name.toLowerCase().replace(/\s+/g, "-")}`,
    name: officer.name,
    jobTitle: officer.role,
    description: officer.statement,
    worksFor: { "@id": organizationId },
  })),
};

export default function LeadershipPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <Breadcrumbs current="Leadership" path="/leadership" />
      <JsonLd data={leadershipPage} />
      <section className="interior-hero interior-hero--leadership">
        <p className="section-label">National leadership</p>
        <h1>Stewarding the renewal.</h1>
        <p className="interior-hero__lede">
          Pi Gamma Omicron’s national officers are preserving the fraternity’s foundation while building the systems, chapters, and relationships its next era requires.
        </p>
      </section>

      <section className="officer-profiles" aria-label="National officers">
        {leadership.map((officer, index) => (
          <article key={officer.name}>
            <div className="officer-profiles__monogram" aria-hidden="true">
              <span>{officer.initials}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </div>
            <div className="officer-profiles__copy">
              <p>{officer.role}</p>
              <h2>{officer.name}</h2>
              <p>{officer.statement}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="leadership-structure" aria-labelledby="leadership-structure-title">
        <div>
          <p className="section-label">Leadership structure</p>
          <h2 id="leadership-structure-title">A record that will grow with the fraternity.</h2>
        </div>
        <div className="leadership-structure__list">
          <article><span>National Organizer</span><p>Official appointment and biography will be added after leadership confirmation.</p></article>
          <article><span>Revival Committee</span><p>The confirmed committee roster and areas of responsibility are being prepared for publication.</p></article>
          <article><span>Chapter Leadership</span><p>Chapter officer profiles will be published as the directory is approved.</p></article>
        </div>
      </section>

      <section className="leadership-principle">
        <p className="section-label">Leadership standard</p>
        <blockquote>Preserve what was built. Organize what is needed. Leave the fraternity stronger.</blockquote>
        <a className="button button--scarlet" href="/contact">Contact the fraternity</a>
      </section>
      <SiteFooter />
    </main>
  );
}
