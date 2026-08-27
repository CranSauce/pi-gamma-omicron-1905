import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { InterestForm } from "./InterestForm";

export const metadata = {
  title: "Express Interest",
  description:
    "Express interest in membership, a current chapter, or future expansion of Pi Gamma Omicron Fraternity.",
  openGraph: {
    title: "Become Part of the Legacy | Pi Gamma Omicron",
    description: "Express interest in membership or future chapter expansion.",
    images: [],
  },
  twitter: {
    title: "Become Part of the Legacy | Pi Gamma Omicron",
    description: "Express interest in membership or future chapter expansion.",
    images: [],
  },
};

export default function JoinPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <section className="interior-hero interior-hero--join">
        <p className="section-label">Membership & expansion interest</p>
        <h1>Become part<br />of the legacy.</h1>
        <p className="interior-hero__lede">
          This form begins a conversation. It is not an application, an offer of membership, or a substitute for the fraternity’s official review process.
        </p>
        <a className="text-link interior-hero__link" href="/membership">Review membership paths and expectations <span aria-hidden="true">↗</span></a>
      </section>

      <section className="join-process" aria-labelledby="join-process-title">
        <div>
          <p className="section-label">What happens next</p>
          <h2 id="join-process-title">A deliberate process.</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Interest received</strong><p>An officer reviews your initial information.</p></li>
          <li><span>02</span><strong>Conversation</strong><p>Qualified prospective members may be invited to an information session.</p></li>
          <li><span>03</span><strong>Formal review</strong><p>Any application and interview process is handled directly by fraternity leadership.</p></li>
          <li><span>04</span><strong>Decision</strong><p>Membership decisions remain with the authorized officers of Pi Gamma Omicron.</p></li>
        </ol>
      </section>

      <section className="interest-form-shell" id="interest-form">
        <InterestForm />
      </section>
      <SiteFooter />
    </main>
  );
}
