import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { members } from "../../db/schema";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Members’ Portal",
  description: "Protected member access for authorized brothers of Pi Gamma Omicron Fraternity.",
  robots: { index: false, follow: false },
};

async function MemberPortal() {
  const user = await requireChatGPTUser("/members");
  let member: typeof members.$inferSelect | undefined;

  try {
    const db = getDb();
    [member] = await db
      .select()
      .from(members)
      .where(eq(members.email, user.email.toLowerCase()))
      .limit(1);
  } catch {
    member = undefined;
  }

  if (!member?.active) {
    return (
      <section className="access-pending">
        <p className="section-label">Authenticated · authorization pending</p>
        <h1>Member access has not been approved for this account.</h1>
        <p>
          You are signed in as <strong>{user.email}</strong>. A national officer must add this address to the active member directory before private fraternity materials become visible.
        </p>
        <div>
          <a className="button button--scarlet" href="/join">Contact through interest form</a>
          <a className="text-link text-link--light" href={chatGPTSignOutPath("/")}>Sign out</a>
        </div>
      </section>
    );
  }

  return (
    <section className="member-dashboard">
      <header>
        <div>
          <p className="section-label">Members’ portal</p>
          <h1>Welcome, {member.fullName}.</h1>
        </div>
        <a className="text-link text-link--light" href={chatGPTSignOutPath("/")}>Sign out</a>
      </header>
      <div className="member-dashboard__identity">
        <span>{member.role.replaceAll("_", " ")}</span>
        <strong>{member.chapter || "National"}</strong>
      </div>
      <div className="member-dashboard__grid">
        <article><span>01</span><h2>Announcements</h2><p>Officer communications and current fraternity notices will appear here.</p></article>
        <article><span>02</span><h2>Calendar</h2><p>Meetings, service work, and chapter events will be available to authorized brothers.</p></article>
        <article><span>03</span><h2>Documents</h2><p>Private documents will remain protected and will never be exposed through public asset paths.</p></article>
        <article><span>04</span><h2>Directory</h2><p>Member and chapter contacts will be role-gated as the portal expands.</p></article>
      </div>
      <p className="member-dashboard__security">Private fraternity symbolism is intentionally omitted until the approved asset is supplied and placed in protected storage.</p>
    </section>
  );
}

export default function MembersPage() {
  return (
    <main className="interior interior--dark">
      <SiteHeader />
      <MemberPortal />
      <SiteFooter />
    </main>
  );
}
