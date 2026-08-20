import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata = {
  title: "Privacy Notice",
  description: "How Pi Gamma Omicron handles information submitted through its interest form.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="interior interior--paper">
      <SiteHeader tone="light" />
      <article className="policy-page">
        <p className="section-label">Privacy notice</p>
        <h1>Your information should be treated with integrity.</h1>
        <p className="policy-page__updated">Initial website policy · August 2026</p>
        <h2>Information collected</h2>
        <p>The interest form collects contact, location, education, chapter-interest, and written-response information that you choose to provide.</p>
        <h2>How it is used</h2>
        <p>Authorized fraternity officers may use the information to review interest, contact prospective members, arrange information sessions, and understand potential chapter expansion.</p>
        <h2>What is not collected here</h2>
        <p>The initial interest form does not request payment-card data, Social Security numbers, government identification, date of birth, or academic transcripts.</p>
        <h2>Access and retention</h2>
        <p>Submissions are intended for authorized fraternity leadership. Information should be retained only as long as it remains useful for the membership or expansion inquiry and applicable organizational obligations.</p>
        <h2>Your choices</h2>
        <p>You may ask fraternity leadership to correct or remove an interest submission. A public privacy contact will be added when the organization approves its permanent administrative email.</p>
        <h2>Important status</h2>
        <p>This notice is an operational first-release policy and should be reviewed by fraternity leadership before broad recruitment or collection of sensitive membership information.</p>
      </article>
      <SiteFooter />
    </main>
  );
}
