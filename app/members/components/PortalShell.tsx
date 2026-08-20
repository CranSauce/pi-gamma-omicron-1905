/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages -- Vinext Link navigation currently throws at runtime. */
import type { ReactNode } from "react";
import {
  canManageMembers,
  canUseDiscussionBoard,
  canUseFraternalDirectory,
  memberRoleLabel,
  type MemberRecord,
} from "../../../lib/member-access";
import { chatGPTSignOutPath } from "../../chatgpt-auth";

export function PortalShell({
  member,
  active,
  children,
}: {
  member: MemberRecord;
  active: "home" | "announcements" | "directory" | "discuss" | "admin";
  children: ReactNode;
}) {
  return (
    <main className="portal-shell">
      <aside className="portal-sidebar">
        <a className="portal-sidebar__brand" href="/members" aria-label="Members portal home">
          <img src="/assets/brand/pi-gamma-omicron-crest.png" width={1024} height={1024} alt="" />
          <span><strong>ΠΓΟ</strong><small>Members’ chamber</small></span>
        </a>

        <nav className="portal-nav" aria-label="Member navigation">
          <PortalLink href="/members" label="Overview" index="01" current={active === "home"} />
          <PortalLink href="/members/announcements" label="Announcements" index="02" current={active === "announcements"} />
          {canUseFraternalDirectory(member.role) && (
            <PortalLink href="/members/directory" label="Directory" index="03" current={active === "directory"} />
          )}
          {canUseDiscussionBoard(member.role) && (
            <PortalLink href="/members/discuss" label="Brotherhood board" index="04" current={active === "discuss"} />
          )}
          {canManageMembers(member.role) && (
            <PortalLink href="/members/admin" label="Administration" index="05" current={active === "admin"} />
          )}
        </nav>

        <div className="portal-sidebar__identity">
          <span>{memberRoleLabel(member.role)}</span>
          <strong>{member.fullName}</strong>
          <small>{member.title || member.chapter || "National membership"}</small>
        </div>

        <div className="portal-sidebar__actions">
          <a href="/">Public website</a>
          <a href={chatGPTSignOutPath("/")}>Sign out</a>
        </div>
      </aside>

      <div className="portal-content">{children}</div>
    </main>
  );
}

function PortalLink({
  href,
  label,
  index,
  current,
}: {
  href: string;
  label: string;
  index: string;
  current: boolean;
}) {
  return (
    <a href={href} aria-current={current ? "page" : undefined}>
      <span>{index}</span>
      <strong>{label}</strong>
    </a>
  );
}
