/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages -- Vinext Link navigation currently throws at runtime. */
import { assetHref, siteHref } from "../../lib/site-urls";

export function SiteHeader({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <header className={`site-header site-header--${tone}`}>
      <a className="site-header__brand" href={siteHref("/")} aria-label="Pi Gamma Omicron home">
        <span>ΠΓΟ</span>
        <small>Founded 1905</small>
      </a>
      <nav className="site-header__links" aria-label="Primary navigation">
        <a href={siteHref("/history")}>History</a>
        <a href={siteHref("/chapters")}>Chapters</a>
        <a href={siteHref("/#pillars")}>Pillars</a>
        <a href={siteHref("/join")}>Interest</a>
        <a className="site-header__members" href={siteHref("/members")}>Members</a>
      </nav>
      <details className="site-header__menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href={siteHref("/history")}>History</a>
          <a href={siteHref("/chapters")}>Chapters</a>
          <a href={siteHref("/#pillars")}>Pillars</a>
          <a href={siteHref("/join")}>Interest</a>
          <a href={siteHref("/members")}>Members</a>
        </nav>
      </details>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__crest">
        <img src={assetHref("/assets/brand/pi-gamma-omicron-crest.png")} width={1024} height={1024} alt="" />
      </div>
      <div className="site-footer__statement">
        <p>Tenebrae Luci Locum Dabunt</p>
        <h2>Darkness shall give way to light.</h2>
      </div>
      <div className="site-footer__meta">
        <div>
          <strong>ΠΓΟ</strong>
          <span>1905 — 2026 — Beyond</span>
        </div>
        <nav aria-label="Footer navigation">
          <a href={siteHref("/history")}>History</a>
          <a href={siteHref("/chapters")}>Chapters</a>
          <a href={siteHref("/join")}>Interest</a>
          <a href={siteHref("/privacy")}>Privacy</a>
          <a href={siteHref("/members")}>Members</a>
        </nav>
      </div>
      <p className="site-footer__note">
        Pi Gamma Omicron Fraternity · Founded in Columbus, Ohio · Brotherhood · Scholarship · Integrity · Uplift
      </p>
    </footer>
  );
}
