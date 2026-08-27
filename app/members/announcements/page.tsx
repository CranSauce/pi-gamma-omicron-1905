import { canPublishAnnouncements, requireActiveMember } from "../../../lib/member-access";
import { listAnnouncements } from "../../../lib/portal-data";
import { PortalShell } from "../components/PortalShell";
import { AnnouncementComposer } from "./AnnouncementComposer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Member Announcements",
  description: "Private Pi Gamma Omicron member announcements.",
  robots: { index: false, follow: false },
};

export default async function AnnouncementsPage() {
  const { member } = await requireActiveMember("/members/announcements");
  const audiences = ["all"];
  if (canPublishAnnouncements(member.role)) audiences.push("officers");
  if (member.chapter) audiences.push(`chapter:${member.chapter}`);

  const rows = await listAnnouncements(audiences);

  return (
    <PortalShell member={member} active="announcements">
      <header className="portal-page-header portal-page-header--compact">
        <div>
          <p className="section-label">Official communications</p>
          <h1>Announcements</h1>
        </div>
        <p>National and chapter notices for the people authorized to receive them.</p>
      </header>

      {canPublishAnnouncements(member.role) && <AnnouncementComposer chapter={member.chapter} />}

      <section className="announcement-list" aria-label="Member announcements">
        {rows.length ? rows.map((announcement) => (
          <article key={announcement.id}>
            <p><span>{audienceLabel(announcement.audience)}</span><time>{formatDate(announcement.createdAt)}</time></p>
            <h2>{announcement.title}</h2>
            <p>{announcement.body}</p>
            <small>Posted by {announcement.author || "Fraternity leadership"}{announcement.authorTitle ? ` · ${announcement.authorTitle}` : ""}</small>
          </article>
        )) : (
          <div className="portal-empty"><strong>No announcements yet.</strong><p>Approved officer communications will be preserved here.</p></div>
        )}
      </section>
    </PortalShell>
  );
}

function audienceLabel(value: string) {
  if (value === "all") return "All members";
  if (value === "officers") return "Officers";
  return value.replace("chapter:", "");
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}
