import { redirect } from "next/navigation";
import {
  canUseFraternalDirectory,
  memberRoleLabel,
  requireActiveMember,
} from "../../../lib/member-access";
import { listActiveMembers } from "../../../lib/portal-data";
import { PortalShell } from "../components/PortalShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Member Directory",
  description: "Private Pi Gamma Omicron fraternity directory.",
  robots: { index: false, follow: false },
};

export default async function DirectoryPage() {
  const { member } = await requireActiveMember("/members/directory");
  if (!canUseFraternalDirectory(member.role)) redirect("/members");

  const directory = await listActiveMembers();
  const visibleMembers = directory.filter((entry) => entry.role !== "applicant");
  const chapters = [...new Set(visibleMembers.map((entry) => entry.chapter || "National"))];

  return (
    <PortalShell member={member} active="directory">
      <header className="portal-page-header portal-page-header--compact">
        <div>
          <p className="section-label">Authorized membership</p>
          <h1>Directory</h1>
        </div>
        <p>One protected record of the people carrying Pi Gamma Omicron forward.</p>
      </header>

      <div className="directory-summary">
        <p><strong>{visibleMembers.length}</strong><span>Active profiles</span></p>
        <p><strong>{chapters.length}</strong><span>Chapter groups</span></p>
      </div>

      <section className="member-directory" aria-label="Active member directory">
        {visibleMembers.length ? visibleMembers.map((entry) => (
          <article key={entry.id}>
            <div className="member-directory__monogram" aria-hidden="true">{initials(entry.fullName)}</div>
            <div className="member-directory__identity">
              <p>{memberRoleLabel(entry.role)}</p>
              <h2>{entry.fullName}</h2>
              <strong>{entry.title || "Member"}</strong>
            </div>
            <dl>
              <div><dt>Chapter</dt><dd>{entry.chapter || "National"}</dd></div>
              {entry.location && <div><dt>Location</dt><dd>{entry.location}</dd></div>}
              <div><dt>Contact</dt><dd><a href={`mailto:${entry.email}`}>{entry.email}</a></dd></div>
            </dl>
            {entry.bio && <p className="member-directory__bio">{entry.bio}</p>}
          </article>
        )) : (
          <div className="portal-empty"><strong>The directory is ready.</strong><p>Authorized profiles will appear as national leadership adds members.</p></div>
        )}
      </section>
    </PortalShell>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "Π";
}
