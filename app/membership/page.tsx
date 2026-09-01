import { membershipPaths, pillars } from "../../lib/site-content";
import { createPageMetadata, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Learn about Pi Gamma Omicron collegiate and alumni membership, fraternity expectations, qualifications, and the official public interest process.";

export const metadata = createPageMetadata({
  title: "Membership, Qualifications & Interest Process",
  description,
  path: "/membership",
});

const process = [
  ["Interest", "Share your background, institution, and reason for seeking Pi Gamma Omicron."],
  ["Conversation", "A fraternity officer reviews your information and may invite you to an information session."],
  ["Formal review", "Authorized leadership explains any official requirements, interviews, and next steps directly."],
  ["Decision", "All membership decisions remain with the authorized officers of Pi Gamma Omicron."],
] as const;

export default function MembershipPage() {
  return (
    <main className="interior interior--dark">
      <SiteHeader />
      <Breadcrumbs current="Membership" path="/membership" tone="dark" />
      <JsonLd data={webPageJsonLd({ path: "/membership", title: "Pi Gamma Omicron Membership", description })} />
      <section className="interior-hero interior-hero--membership">
        <p className="section-label">Membership</p>
        <h1>Brotherhood with<br />work behind it.</h1>
        <p className="interior-hero__lede">
          Membership begins with shared purpose: intellectual growth, principled leadership, genuine fellowship, and service that leaves a community stronger.
        </p>
      </section>

      <section className="membership-why" aria-labelledby="membership-why-title">
        <div>
          <p className="section-label">Why Pi Gamma Omicron?</p>
          <h2 id="membership-why-title">Join a legacy still being built.</h2>
        </div>
        <p>
          Pi Gamma Omicron offers the rare responsibility of carrying forward a historic Black collegiate fraternity while helping shape its modern future. Prospective members should be prepared to learn, contribute, serve, and hold one another to a meaningful standard.
        </p>
      </section>

      <section className="membership-paths" aria-labelledby="membership-paths-title">
        <div className="section-heading section-heading--light">
          <p className="section-label">Paths to membership</p>
          <h2 id="membership-paths-title">Different seasons.<br />One standard.</h2>
        </div>
        <div className="membership-paths__grid">
          {membershipPaths.map((path) => (
            <article key={path.title}>
              <span>{path.number}</span>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
            </article>
          ))}
        </div>
        <p className="membership-paths__note">
          Official eligibility requirements, intake procedures, and membership decisions are communicated by authorized fraternity leadership. Submitting interest is not an application or an offer of membership.
        </p>
      </section>

      <section className="membership-expectations" aria-labelledby="membership-expectations-title">
        <div>
          <p className="section-label">What membership asks</p>
          <h2 id="membership-expectations-title">The pillars are active commitments.</h2>
        </div>
        <ol>
          {pillars.map((pillar) => (
            <li key={pillar.name}><span>{pillar.number}</span><strong>{pillar.name}</strong><p>{pillar.description}</p></li>
          ))}
        </ol>
      </section>

      <section className="membership-process" aria-labelledby="membership-process-title">
        <div className="section-heading">
          <p className="section-label">The public interest process</p>
          <h2 id="membership-process-title">A deliberate first step.</h2>
        </div>
        <ol>
          {process.map(([title, description], index) => (
            <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></li>
          ))}
        </ol>
        <a className="button button--scarlet" href="/join">Express your interest</a>
      </section>
      <SiteFooter />
    </main>
  );
}
