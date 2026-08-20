/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export function SiteHeader({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <header className={`site-header site-header--${tone}`}>
      <Link className="site-header__brand" href="/" aria-label="Pi Gamma Omicron home">
        <span>ΠΓΟ</span>
        <small>Founded 1905</small>
      </Link>
      <nav className="site-header__links" aria-label="Primary navigation">
        <Link href="/history">History</Link>
        <Link href="/chapters">Chapters</Link>
        <Link href="/#pillars">Pillars</Link>
        <Link href="/join">Interest</Link>
        <Link className="site-header__members" href="/members">Members</Link>
      </nav>
      <details className="site-header__menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          <Link href="/history">History</Link>
          <Link href="/chapters">Chapters</Link>
          <Link href="/#pillars">Pillars</Link>
          <Link href="/join">Interest</Link>
          <Link href="/members">Members</Link>
        </nav>
      </details>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__crest">
        <img src="/assets/brand/pi-gamma-omicron-crest.png" width={1024} height={1024} alt="" />
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
          <Link href="/history">History</Link>
          <Link href="/chapters">Chapters</Link>
          <Link href="/join">Interest</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/members">Members</Link>
        </nav>
      </div>
      <p className="site-footer__note">
        Pi Gamma Omicron Fraternity · Founded in Columbus, Ohio · Brotherhood · Scholarship · Integrity · Uplift
      </p>
    </footer>
  );
}
