import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { interests, members } from "../../../db/schema";
import { requireMemberManager } from "../../../lib/member-access";
import { PortalShell } from "../components/PortalShell";
import { AdministrationPanels } from "./AdministrationPanels";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Member Administration",
  description: "Protected Pi Gamma Omicron membership administration.",
  robots: { index: false, follow: false },
};

export default async function MemberAdministrationPage() {
  const { member } = await requireMemberManager("/members/admin");
  const db = getDb();
  const [memberRows, interestRows] = await Promise.all([
    db.select().from(members).orderBy(desc(members.active), members.fullName),
    db.select({
      id: interests.id,
      fullName: interests.fullName,
      email: interests.email,
      institution: interests.institution,
      institutionType: interests.institutionType,
      chapterInterest: interests.chapterInterest,
      currentStatus: interests.currentStatus,
      whyInterested: interests.whyInterested,
      status: interests.status,
      createdAt: interests.createdAt,
    }).from(interests).orderBy(desc(interests.createdAt)).limit(100),
  ]);

  return (
    <PortalShell member={member} active="admin">
      <header className="portal-page-header portal-page-header--compact">
        <div>
          <p className="section-label">National operations</p>
          <h1>Administration</h1>
        </div>
        <p>Membership authority, applicant review, and the human infrastructure of the fraternity.</p>
      </header>
      <AdministrationPanels memberRows={memberRows} interestRows={interestRows} currentRole={member.role} />
    </PortalShell>
  );
}
