import { createPageMetadata, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Contact Pi Gamma Omicron for membership, chapter expansion, media, historical research, and general fraternity inquiries.";

export const metadata = createPageMetadata({
  title: "Contact Pi Gamma Omicron",
  description,
  path: "/contact",
});

const inquiryPaths = [
  {
    number: "01",
    title: "Membership",
    description: "Begin the public interest process for collegiate or alumni and graduate membership.",
    label: "Express membership interest",
    href: "/join",
  },
  {
    number: "02",
    title: "Chapter expansion",
    description: "Tell national leadership about a campus, interest group, or chapter reactivation opportunity.",
    label: "Start a chapter conversation",
    href: "/join",
  },
  {
    number: "03",
    title: "Media & historical research",
    description: "Review the source-aware public archive while the fraternity confirms its official research contact channel.",
    label: "Enter the archive",
    href: "/history#archive",
  },
] as const;

export default function ContactPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <Breadcrumbs current="Contact" path="/contact" />
      <JsonLd data={webPageJsonLd({ path: "/contact", title: "Contact Pi Gamma Omicron", description, type: "ContactPage" })} />
      <section className="interior-hero interior-hero--contact">
        <p className="section-label">Contact Pi Gamma Omicron</p>
        <h1>Start with the<br />right conversation.</h1>
        <p className="interior-hero__lede">
          Whether you are seeking brotherhood, exploring chapter expansion, or researching the fraternity’s history, choose the path that best fits your inquiry.
        </p>
      </section>

      <section className="contact-directory" aria-label="Inquiry directory">
        {inquiryPaths.map((path) => (
          <article key={path.title}>
            <span>{path.number}</span>
            <h2>{path.title}</h2>
            <p>{path.description}</p>
            <a className="text-link" href={path.href}>{path.label} <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </section>

      <section className="contact-general">
        <div>
          <p className="section-label">General inquiries</p>
          <h2>One official voice.</h2>
        </div>
        <div>
          <p>
            The fraternity’s official general, media, and historical research inboxes are being confirmed for public launch. They will be published here once authorized by national leadership.
          </p>
          <p className="contact-general__status">Contact directory · Awaiting leadership confirmation</p>
        </div>
      </section>

      <section className="contact-members">
        <p className="section-label">Already a brother?</p>
        <h2>Continue inside the members’ chamber.</h2>
        <a className="button button--scarlet" href="/members">Enter members area</a>
      </section>
      <SiteFooter />
    </main>
  );
}
