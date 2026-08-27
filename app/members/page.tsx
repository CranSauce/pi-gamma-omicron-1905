/* eslint-disable @next/next/no-html-link-for-pages -- Vinext Link navigation currently throws at runtime. */
import {
  canManageMembers,
  canPublishAnnouncements,
  canUseDiscussionBoard,
  canUseFraternalDirectory,
  findMemberByEmail,
} from "../../lib/member-access";
import {
  countActiveMembers,
  countNewInterests,
  listAnnouncements,
  listDiscussionThreads,
  type MemberRecord,
} from "../../lib/portal-data";
import { getPortalUser, portalSignInPath, portalSignOutPath } from "../../lib/portal-auth";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { MemberPortalIntro } from "./MemberPortalIntro";
import { PortalShell } from "./components/PortalShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Members’ Portal",
  description: "Protected member access for authorized brothers of Pi Gamma Omicron Fraternity.",
  robots: { index: false, follow: false },
};

async function MemberPortal({ authError }: { authError?: string }) {
  const user = await getPortalUser();
  if (!user) {
    return (
      <main className="interior interior--dark">
        <SiteHeader />
        <section className="access-pending">
          <p className="section-label">Members’ chamber · secure access</p>
          <h1>{authError ? "Member sign-in is not ready yet." : "Enter the private members’ chamber."}</h1>
          <p>
            {authError
              ? "The Supabase or Google authentication settings still need to be completed by the site administrator."
              : "Authorized members use their approved Google email. Access is matched against the private fraternity directory after sign-in."}
          </p>
          <div>
            {!authError && <a className="button button--scarlet" href={portalSignInPath("/members")}>Continue with Google</a>}
            <a className="text-link text-link--light" href="/">Return to public website</a>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  let member: MemberRecord | undefined;

  try {
    member = await findMemberByEmail(user.email, user.displayName);
  } catch {
    member = undefined;
  }

  if (!member?.active) {
    return (
      <main className="interior interior--dark">
        <SiteHeader />
        <section className="access-pending">
          <p className="section-label">Authenticated · authorization pending</p>
          <h1>Member access has not been approved for this account.</h1>
          <p>
            You are signed in as <strong>{user.email}</strong>. A national officer must add this address to the active member directory before private fraternity materials become visible.
          </p>
          <div>
            <a className="button button--scarlet" href="/join">Contact through interest form</a>
            <a className="text-link text-link--light" href={portalSignOutPath("/")}>Sign out</a>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  const announcementAudiences = ["all"];
  if (canPublishAnnouncements(member.role)) announcementAudiences.push("officers");
  if (member.chapter) announcementAudiences.push(`chapter:${member.chapter}`);
  const [memberTotal, announcementRows, discussionRows, openInterestTotal] = await Promise.all([
    countActiveMembers(),
    listAnnouncements(announcementAudiences, 3),
    listDiscussionThreads(4),
    canManageMembers(member.role) ? countNewInterests() : Promise.resolve(0),
  ]);

  return (
    <>
      <MemberPortalIntro />
      <PortalShell member={member} active="home">
      <header className="portal-page-header">
        <div>
          <p className="section-label">Members’ portal</p>
          <h1>Welcome back,<br />{member.fullName.split(" ")[0]}.</h1>
        </div>
        <p>
          A private operating space for the work of brotherhood—communications, directory, discussion, and organizational stewardship.
        </p>
      </header>

      <section className="portal-metrics" aria-label="Portal summary">
        <article><span>Active directory</span><strong>{memberTotal}</strong><small>Authorized accounts</small></article>
        <article><span>Announcements</span><strong>{announcementRows.length}</strong><small>Most recent notices</small></article>
        <article><span>Board activity</span><strong>{discussionRows.length}</strong><small>Recent conversations</small></article>
        {canManageMembers(member.role) && (
          <article><span>Interest queue</span><strong>{openInterestTotal}</strong><small>Awaiting review</small></article>
        )}
      </section>

      <div className="portal-dashboard-grid">
        <section className="portal-panel portal-panel--wide" aria-labelledby="dashboard-announcements">
          <div className="portal-panel__heading">
            <div><span>01</span><h2 id="dashboard-announcements">Latest announcements</h2></div>
            <a href="/members/announcements">View all</a>
          </div>
          {announcementRows.length ? (
            <div className="announcement-list announcement-list--compact">
              {announcementRows.map((announcement) => (
                <article key={announcement.id}>
                  <p><span>{announcement.audience}</span><time>{formatDate(announcement.createdAt)}</time></p>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.body}</p>
                  <small>Posted by {announcement.author || "Fraternity leadership"}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyPortalState title="No announcements yet" body="Officer communications will appear here as the portal comes online." />
          )}
        </section>

        {canUseDiscussionBoard(member.role) && (
          <section className="portal-panel" aria-labelledby="dashboard-discussions">
            <div className="portal-panel__heading">
              <div><span>02</span><h2 id="dashboard-discussions">Brotherhood board</h2></div>
              <a href="/members/discuss">Open board</a>
            </div>
            {discussionRows.length ? (
              <div className="discussion-list discussion-list--compact">
                {discussionRows.map((thread) => (
                  <a href={`/members/discuss/${thread.id}`} key={thread.id}>
                    <span>{thread.category}</span>
                    <strong>{thread.title}</strong>
                    <small>{thread.author || "Member"} · {formatDate(thread.createdAt)}</small>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyPortalState title="The board is ready" body="Start the first private conversation with the brotherhood." />
            )}
          </section>
        )}

        <section className="portal-panel" aria-labelledby="dashboard-actions">
          <div className="portal-panel__heading">
            <div><span>03</span><h2 id="dashboard-actions">Your access</h2></div>
          </div>
          <div className="portal-quick-links">
            <a href="/members/announcements"><span>Officer notices</span><strong>Read announcements</strong></a>
            {canUseFraternalDirectory(member.role) && <a href="/members/directory"><span>Active membership</span><strong>Open directory</strong></a>}
            {canManageMembers(member.role) && <a href="/members/admin"><span>National operations</span><strong>Manage members</strong></a>}
          </div>
        </section>
      </div>

        <p className="member-dashboard__security">The Mystery School mark identifies this protected operating chamber for authorized fraternity members.</p>
      </PortalShell>
    </>
  );
}

function EmptyPortalState({ title, body }: { title: string; body: string }) {
  return <div className="portal-empty"><strong>{title}</strong><p>{body}</p></div>;
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ auth_error?: string }> }) {
  const { auth_error: authError } = await searchParams;
  return <MemberPortal authError={authError} />;
}
