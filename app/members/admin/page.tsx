import { requireMemberManager } from "../../../lib/member-access";
import { listAllMembers, listInterests } from "../../../lib/portal-data";
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
  const [memberRows, interestRows] = await Promise.all([
    listAllMembers(),
    listInterests(100),
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
