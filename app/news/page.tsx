import { publicUpdates } from "../../lib/site-content";
import { createPageMetadata, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Official Pi Gamma Omicron news, chapter updates, historical preservation work, and information about the 2027 National Conference in Charlotte, North Carolina.";

export const metadata = createPageMetadata({
  title: "News, Events & 2027 National Conference",
  description,
  path: "/news",
});

export default function NewsPage() {
  return (
    <main className="interior interior--dark">
      <SiteHeader />
      <Breadcrumbs current="News & Events" path="/news" tone="dark" />
      <JsonLd data={webPageJsonLd({ path: "/news", title: "Pi Gamma Omicron News & Events", description, type: "CollectionPage" })} />
      <section className="conference-hero" id="charlotte-2027" aria-labelledby="conference-title">
        <div className="conference-hero__year" aria-hidden="true">2027</div>
        <div className="conference-hero__copy">
          <p className="section-label">National Conference · Save the date</p>
          <h1 id="conference-title">Charlotte,<br />North Carolina.</h1>
          <p>Pi Gamma Omicron will gather in Charlotte in 2027. Dates, venue details, registration, and the conference program will be announced after they are finalized.</p>
          <span>Dates forthcoming</span>
        </div>
      </section>

      <section className="news-desk" id="revival" aria-labelledby="news-desk-title">
        <div className="section-heading section-heading--light">
          <p className="section-label">News & events</p>
          <h2 id="news-desk-title">The public record of what comes next.</h2>
        </div>
        <div className="news-desk__grid">
          {publicUpdates.map((update, index) => (
            <article key={update.title}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><p>{update.type}</p></div>
              <small>{update.date}</small>
              <h3>{update.title}</h3>
              <p>{update.description}</p>
              <a className="text-link text-link--light" href={update.href}>Read the related record <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="news-standards">
        <p className="section-label">Official communications</p>
        <h2>Clear information, published with care.</h2>
        <p>
          This page will carry approved national announcements, chapter news, community service, campus events, new member announcements, conference details, and revival updates as they are ready for public release.
        </p>
        <a className="button button--scarlet" href="/contact">Media & research inquiries</a>
      </section>
      <SiteFooter />
    </main>
  );
}
