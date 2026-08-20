import { FormEvent, ReactNode, useState } from "react";
import { MemberPortalIntro } from "../app/members/MemberPortalIntro";
import { assetHref, siteHref } from "../lib/site-urls";

type MemberRoute = "home" | "announcements" | "directory" | "discuss" | "admin";

const announcements = [
  {
    audience: "All members",
    date: "Aug 18, 2026",
    title: "Founders Day planning and archival review",
    body: "Leadership is assembling the next Founders Day program and reviewing new archival materials for the living history project.",
    author: "National leadership",
  },
  {
    audience: "Beta Chapter",
    date: "Aug 12, 2026",
    title: "Community service weekend",
    body: "Beta Chapter brothers are coordinating a service project focused on mentorship, civic participation, and neighborhood uplift.",
    author: "Chapter leadership",
  },
  {
    audience: "Officers",
    date: "Aug 5, 2026",
    title: "Digital renewal working session",
    body: "Officer feedback is requested on member onboarding, chapter records, and the next phase of the national website.",
    author: "Kawame Curry",
  },
];

const threads = [
  { category: "History", title: "Archival leads for the founding eleven", summary: "Share university collections, newspapers, and family-history leads that may help recover founder biographies.", author: "Zeke Lipscomb", replies: 8 },
  { category: "Service", title: "Building a national mentorship framework", summary: "What would a shared mentorship program look like across Alpha, Beta, and future chapters?", author: "Kawame Curry", replies: 5 },
  { category: "Brotherhood", title: "Ideas for the next national gathering", summary: "A planning thread for programming, ritual, service, and the public history experience.", author: "National leadership", replies: 3 },
];

function memberRoute(path: string): MemberRoute {
  if (path.includes("/announcements")) return "announcements";
  if (path.includes("/directory")) return "directory";
  if (path.includes("/discuss")) return "discuss";
  if (path.includes("/admin")) return "admin";
  return "home";
}

export function MemberPreview({ route }: { route: string }) {
  const active = memberRoute(route);
  const [notice, setNotice] = useState("");

  function simulate(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <>
      {active === "home" && <MemberPortalIntro />}
      {notice && <div className="demo-notice" role="status">{notice}</div>}
      <DemoPortalShell active={active}>
        <div className="portal-demo-status">
          <span>Authenticated preview</span>
          <p>This chamber uses representative data. Nothing displayed or submitted here is stored.</p>
        </div>
        {active === "home" && <Overview />}
        {active === "announcements" && <Announcements onSimulate={simulate} />}
        {active === "directory" && <Directory />}
        {active === "discuss" && <Discussions onSimulate={simulate} />}
        {active === "admin" && <Administration onSimulate={simulate} />}
      </DemoPortalShell>
    </>
  );
}
function DemoPortalShell({ active, children }: { active: MemberRoute; children: ReactNode }) {
  return (
    <main className="portal-shell">
      <aside className="portal-sidebar">
        <a className="portal-sidebar__brand" href={siteHref("/members")} aria-label="Members portal preview home">
          <img className="portal-sidebar__mystery-mark" src={assetHref("/assets/brand/mystery-school-of-pi.png")} width={922} height={922} alt="" />
          <span><strong>ΠΓΟ</strong><small>Members’ chamber</small></span>
        </a>

        <nav className="portal-nav" aria-label="Member preview navigation">
          <PortalLink href="/members" label="Overview" index="01" current={active === "home"} />
          <PortalLink href="/members/announcements" label="Announcements" index="02" current={active === "announcements"} />
          <PortalLink href="/members/directory" label="Directory" index="03" current={active === "directory"} />
          <PortalLink href="/members/discuss" label="Brotherhood board" index="04" current={active === "discuss"} />
          <PortalLink href="/members/admin" label="Administration" index="05" current={active === "admin"} />
        </nav>

        <div className="portal-sidebar__identity">
          <span>National officer · Preview</span>
          <strong>Kawame Curry</strong>
          <small>Vice President · National</small>
        </div>

        <div className="portal-sidebar__actions">
          <a href={siteHref("/")}>Public website</a>
          <a href={siteHref("/")}>Exit preview</a>
        </div>
      </aside>
      <div className="portal-content">{children}</div>
    </main>
  );
}

function PortalLink({ href, label, index, current }: { href: string; label: string; index: string; current: boolean }) {
  return (
    <a href={siteHref(href)} aria-current={current ? "page" : undefined}>
      <span>{index}</span><strong>{label}</strong>
    </a>
  );
}

function Overview() {
  return (
    <>
      <header className="portal-page-header">
        <div><p className="section-label">Members’ portal</p><h1>Welcome back,<br />Kawame.</h1></div>
        <p>A private operating space for the work of brotherhood—communications, directory, discussion, and organizational stewardship.</p>
      </header>

      <section className="portal-metrics" aria-label="Portal summary">
        <article><span>Active directory</span><strong>2</strong><small>Authorized preview accounts</small></article>
        <article><span>Announcements</span><strong>3</strong><small>Most recent notices</small></article>
        <article><span>Board activity</span><strong>3</strong><small>Recent conversations</small></article>
        <article><span>Interest queue</span><strong>2</strong><small>Awaiting review</small></article>
      </section>

      <div className="portal-dashboard-grid">
        <section className="portal-panel portal-panel--wide" aria-labelledby="demo-announcements">
          <div className="portal-panel__heading"><div><span>01</span><h2 id="demo-announcements">Latest announcements</h2></div><a href={siteHref("/members/announcements")}>View all</a></div>
          <div className="announcement-list announcement-list--compact">
            {announcements.slice(0, 2).map((announcement) => <Announcement key={announcement.title} announcement={announcement} />)}
          </div>
        </section>
        <section className="portal-panel" aria-labelledby="demo-board">
          <div className="portal-panel__heading"><div><span>02</span><h2 id="demo-board">Brotherhood board</h2></div><a href={siteHref("/members/discuss")}>Open board</a></div>
          <div className="discussion-list discussion-list--compact">
            {threads.slice(0, 2).map((thread) => <a href={siteHref("/members/discuss")} key={thread.title}><span>{thread.category}</span><strong>{thread.title}</strong><small>{thread.author} · Preview</small></a>)}
          </div>
        </section>
        <section className="portal-panel" aria-labelledby="demo-access">
          <div className="portal-panel__heading"><div><span>03</span><h2 id="demo-access">Your access</h2></div></div>
          <div className="portal-quick-links">
            <a href={siteHref("/members/announcements")}><span>Officer notices</span><strong>Read announcements</strong></a>
            <a href={siteHref("/members/directory")}><span>Active membership</span><strong>Open directory</strong></a>
            <a href={siteHref("/members/admin")}><span>National operations</span><strong>Manage members</strong></a>
          </div>
        </section>
      </div>
      <p className="member-dashboard__security">The Mystery School mark identifies this protected operating chamber for authorized fraternity members.</p>
    </>
  );
}

function Announcements({ onSimulate }: { onSimulate: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSimulate("Announcement previewed successfully. No notice was published.");
  }
  return (
    <>
      <header className="portal-page-header portal-page-header--compact">
        <div><p className="section-label">Communications</p><h1>Officer<br />announcements.</h1></div>
        <p>Publish national, officer, or chapter-specific notices from one protected place.</p>
      </header>
      <form className="portal-composer" onSubmit={submit}>
        <div className="portal-composer__heading"><span>Preview composer</span><h2>Publish a notice</h2></div>
        <label>Title<input defaultValue="Founders Day planning update" /></label>
        <label>Audience<select defaultValue="all"><option value="all">All members</option><option>Officers</option><option>Alpha Chapter</option><option>Beta Chapter</option></select></label>
        <label>Message<textarea defaultValue="Leadership will meet next week to review Founders Day programming and archival priorities." /></label>
        <div className="portal-composer__submit"><button className="button button--scarlet" type="submit">Preview announcement</button><small>Demo mode · publishing disabled</small></div>
      </form>
      <div className="announcement-list">{announcements.map((announcement) => <Announcement key={announcement.title} announcement={announcement} />)}</div>
    </>
  );
}

function Announcement({ announcement }: { announcement: (typeof announcements)[number] }) {
  return <article><p><span>{announcement.audience}</span><time>{announcement.date}</time></p><h3>{announcement.title}</h3><p>{announcement.body}</p><small>Posted by {announcement.author}</small></article>;
}

function Directory() {
  const people = [
    { initials: "ZL", role: "President", name: "Zeke Lipscomb", chapter: "National", location: "Columbus, Ohio", email: "Verified member email", bio: "National President and steward of the fraternity's renewal." },
    { initials: "KC", role: "Vice President", name: "Kawame Curry", chapter: "National", location: "National leadership", email: "Verified member email", bio: "National Vice President supporting member operations, communications, and growth." },
  ];
  return (
    <>
      <header className="portal-page-header portal-page-header--compact"><div><p className="section-label">Brotherhood</p><h1>Member<br />directory.</h1></div><p>A role-aware directory for active brothers, chapter leadership, and national officers.</p></header>
      <div className="directory-summary"><p><strong>2</strong><span>Preview members</span></p><p><strong>2</strong><span>National officers</span></p></div>
      <section className="member-directory" aria-label="Preview member directory">
        {people.map((person) => <article key={person.name}><div className="member-directory__monogram">{person.initials}</div><div className="member-directory__identity"><p>{person.role}</p><h2>{person.name}</h2><strong>{person.chapter}</strong></div><dl><div><dt>Location</dt><dd>{person.location}</dd></div><div><dt>Email</dt><dd>{person.email}</dd></div></dl><p className="member-directory__bio">{person.bio}</p></article>)}
      </section>
    </>
  );
}

function Discussions({ onSimulate }: { onSimulate: (message: string) => void }) {
  return (
    <>
      <header className="portal-page-header portal-page-header--compact"><div><p className="section-label">Private conversation</p><h1>Brotherhood<br />board.</h1></div><p>Organized discussion for history, service, chapter operations, and the work ahead.</p></header>
      <div className="portal-page-header__action demo-inline-action"><button className="button button--scarlet" type="button" onClick={() => onSimulate("Thread composer opened in preview mode. No post was created.")}>Start a discussion</button></div>
      <section className="discussion-board" aria-label="Preview discussions">
        <div className="discussion-board__labels"><span>Conversation</span><span>Activity</span></div>
        {threads.map((thread) => <a className="discussion-thread-card" href={siteHref("/members/discuss")} key={thread.title}><div><p><span>{thread.category}</span></p><h2>{thread.title}</h2><p>{thread.summary}</p><small>Started by {thread.author}</small></div><div><strong>{thread.replies}</strong><span>Replies</span><time>Preview</time></div></a>)}
      </section>
    </>
  );
}

function Administration({ onSimulate }: { onSimulate: (message: string) => void }) {
  function submit(event: FormEvent<HTMLFormElement>, message: string) {
    event.preventDefault();
    onSimulate(message);
  }
  return (
    <>
      <header className="portal-page-header portal-page-header--compact"><div><p className="section-label">National operations</p><h1>Administration.</h1></div><p>Manage verified members, roles, chapters, and the incoming interest queue.</p></header>
      <section className="admin-section">
        <div className="admin-section__heading"><p className="section-label">Member access</p><h2>Add an authorized brother.</h2><p>Production access will be granted only after Google email verification and officer approval.</p></div>
        <form className="admin-add-member" onSubmit={(event) => submit(event, "Member invitation simulated. No account was changed.")}>
          <label>Full name<input placeholder="Brother's full name" required /></label>
          <label>Verified Google email<input type="email" placeholder="name@example.com" required /></label>
          <label>Role<select defaultValue="brother"><option value="brother">Brother</option><option>Chapter officer</option><option>National officer</option><option>Alumni</option></select></label>
          <label>Chapter<select defaultValue="Alpha Chapter"><option>Alpha Chapter</option><option>Beta Chapter</option><option>National</option></select></label>
          <button className="button button--scarlet" type="submit">Preview member invite</button>
        </form>
      </section>
      <section className="admin-section">
        <div className="admin-section__heading"><p className="section-label">Active directory</p><h2>Manage roles and status.</h2><p>Kawame can update organizational access without changing source code.</p></div>
        <div className="admin-member-list">
          {["Zeke Lipscomb", "Kawame Curry"].map((name) => <form key={name} onSubmit={(event) => submit(event, `${name}'s preview record was not changed.`)}><header><div className="member-directory__monogram">{name.split(" ").map((part) => part[0]).join("")}</div><div><strong>{name}</strong><span>Verified Google identity</span></div></header><div className="admin-member-list__fields"><label>Role<select defaultValue="National officer"><option>National officer</option><option>Chapter officer</option><option>Brother</option></select></label><label>Chapter<select defaultValue="National"><option>National</option><option>Alpha Chapter</option><option>Beta Chapter</option></select></label><label className="admin-member-list__active"><input type="checkbox" defaultChecked /> Active access</label></div><button className="portal-text-button" type="submit">Preview update</button></form>)}
        </div>
      </section>
      <section className="admin-section">
        <div className="admin-section__heading"><p className="section-label">Interest queue</p><h2>Review prospective members.</h2><p>Representative submissions demonstrate the review workflow without exposing real information.</p></div>
        <div className="interest-review-list">
          {[{ name: "Preview Applicant", school: "The Ohio State University", chapter: "Alpha Chapter" }, { name: "Sample Applicant", school: "Kennesaw State University", chapter: "Beta Chapter" }].map((person) => <article key={person.name}><header><div><span>New inquiry</span><h3>{person.name}</h3><p>applicant@example.com</p></div><time>Preview</time></header><dl><div><dt>Institution</dt><dd>{person.school}</dd></div><div><dt>Interest</dt><dd>{person.chapter}</dd></div><div><dt>Status</dt><dd>Awaiting review</dd></div></dl><button className="portal-text-button" type="button" onClick={() => onSimulate(`${person.name}'s review status was simulated only.`)}>Preview review action</button></article>)}
        </div>
      </section>
    </>
  );
}
