import { absoluteUrl, createPageMetadata, organizationId, webPageJsonLd } from "../../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Seo";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const description =
  "Meet the eleven founders of Pi Gamma Omicron and explore source-aware biographical details recovered through Ohio State University Archives research.";

export const metadata = createPageMetadata({
  title: "The Eleven Founders",
  description,
  path: "/founders",
});

const founderProfiles = [
  {
    name: "Leroy Barnett",
    record: "Ohio State student directories list Barnett from 1905 through 1910, including three years in law. The 1910 Makio includes his senior portrait.",
  },
  {
    name: "William Berry",
    record: "Ohio State student directories list Berry as an arts student during the 1904–05 and 1905–06 academic years.",
  },
  {
    name: "W. E. Davis",
    record: "Directories trace Davis from arts into four years of pharmacy study. The 1908 Makio includes his senior portrait and Pharmaceutical Association activity.",
  },
  {
    name: "Richard Pettiford",
    record: "The OSU Archives research sheet did not locate Pettiford in the student directories checked for 1903–1908. Biographical research remains ongoing.",
  },
  {
    name: "Elmer Shackelford",
    record: "Directories trace Shackelford from arts into law from 1902 through 1906. Ohio State Archives identifies him as the university’s first African American to earn its then-equivalent certificate of law.",
  },
  {
    name: "John Shavers",
    record: "The OSU Archives research sheet did not locate Shavers in the student directories checked for 1903–1908. Biographical research remains ongoing.",
  },
  {
    name: "Norman Thorne",
    record: "Ohio State student directories list Thorne as a first-year agriculture student during the 1905–06 academic year.",
  },
  {
    name: "H. A. Turner",
    record: "The OSU Archives research sheet did not locate Turner in the student directories checked for 1903–1908. Biographical research remains ongoing.",
  },
  {
    name: "C. C. Underwood",
    record: "Ohio State student directories list Underwood as a first-year pharmacy student during the 1905–06 academic year.",
  },
  {
    name: "Walter Williams",
    record: "Ohio State student directories list Williams in law during 1906–07. A possible Makio identification in an engineering group remains unconfirmed.",
  },
  {
    name: "William Woodward",
    record: "The OSU Archives research sheet did not locate Woodward in the student directories checked for 1903–1908. Biographical research remains ongoing.",
  },
] as const;

const foundersPage = {
  ...webPageJsonLd({
    path: "/founders",
    title: "The Eleven Founders of Pi Gamma Omicron",
    description,
    type: "CollectionPage",
  }),
  citation: [
    "https://library.osu.edu/site/archives/2012/03/28/tracking-the-early-history-of-african-american-fraternities-at-osu/",
    "https://library.osu.edu/documents/university-archives/pi_gamma_omicron_members.pdf",
  ],
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: founderProfiles.length,
    itemListElement: founderProfiles.map((founder, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        "@id": `${absoluteUrl("/founders")}#${founder.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: founder.name,
        description: founder.record,
        memberOf: { "@id": organizationId },
      },
    })),
  },
};

export default function FoundersPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <Breadcrumbs current="Founders" path="/founders" />
      <JsonLd data={foundersPage} />

      <section className="interior-hero interior-hero--founders">
        <p className="section-label">The founding eleven</p>
        <h1>The eleven who<br />began the legacy.</h1>
        <p className="interior-hero__lede">
          Contemporary reporting named eleven Black students as the founders of Pi Gamma Omicron. Ohio State University Archives later recovered directory and yearbook records that return parts of their individual stories to the public record.
        </p>
      </section>

      <section className="founder-research-intro" aria-labelledby="founder-research-title">
        <div>
          <p className="section-label">The research standard</p>
          <h2 id="founder-research-title">A beginning, not a completed biography.</h2>
        </div>
        <div>
          <p>
            These notes summarize a March 2012 Ohio State Archives research sheet compiled from student directories and <em>Makio</em> yearbooks. “Not located” describes the limits of that specific search; it is not evidence that a founder lacked a connection to the fraternity or university.
          </p>
          <p>
            Spellings follow the fraternity’s approved founder list. Historical variants—including “LeRoy” for Leroy Barnett—remain visible in the linked source record.
          </p>
        </div>
      </section>

      <section className="founder-research-grid" aria-label="Pi Gamma Omicron founders">
        {founderProfiles.map((founder, index) => (
          <article id={founder.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")} key={founder.name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{founder.name}</h2>
            <p>{founder.record}</p>
          </article>
        ))}
      </section>

      <section className="founder-sources" aria-labelledby="founder-sources-title">
        <div>
          <p className="section-label">Independent archival sources</p>
          <h2 id="founder-sources-title">Continue into the record.</h2>
        </div>
        <div>
          <a className="text-link text-link--light" href="https://library.osu.edu/site/archives/2012/03/28/tracking-the-early-history-of-african-american-fraternities-at-osu/">Ohio State Archives history <span aria-hidden="true">↗</span></a>
          <a className="text-link text-link--light" href="https://library.osu.edu/documents/university-archives/pi_gamma_omicron_members.pdf">OSU founder research sheet <span aria-hidden="true">↗</span></a>
          <a className="button button--scarlet" href="/history">Explore the full history</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
