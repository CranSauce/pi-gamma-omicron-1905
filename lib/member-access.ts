import { redirect } from "next/navigation";
import {
  createMemberRecord,
  findMemberRecordByEmail,
  updateMemberRecord,
  type MemberRecord,
} from "./portal-data";
import { getPortalUser, requirePortalUser, type PortalUser } from "./portal-auth";

export const memberRoles = [
  "super_admin",
  "national_officer",
  "chapter_officer",
  "brother",
  "alumni",
  "applicant",
] as const;

export type MemberRole = (typeof memberRoles)[number];
export type { MemberRecord };

export const roleLabels: Record<MemberRole, string> = {
  super_admin: "Super administrator",
  national_officer: "National officer",
  chapter_officer: "Chapter officer",
  brother: "Brother",
  alumni: "Alumni",
  applicant: "Applicant",
};

export function isMemberRole(value: string): value is MemberRole {
  return memberRoles.includes(value as MemberRole);
}

export function memberRoleLabel(role: string) {
  return isMemberRole(role) ? roleLabels[role] : role.replaceAll("_", " ");
}

export function canManageMembers(role: string) {
  return role === "super_admin" || role === "national_officer";
}

export function canPublishAnnouncements(role: string) {
  return canManageMembers(role) || role === "chapter_officer";
}

export function canUseFraternalDirectory(role: string) {
  return role !== "applicant";
}

export function canUseDiscussionBoard(role: string) {
  return role !== "applicant";
}

export async function findMemberByEmail(email: string, displayName?: string) {
  const normalizedEmail = email.trim().toLowerCase();
  let member = await findMemberRecordByEmail(normalizedEmail);

  if (!bootstrapSuperAdminEmails().has(normalizedEmail)) return member;

  if (member) {
    if (member.role !== "super_admin" || !member.active) {
      member = await updateMemberRecord(member.id, {
        role: "super_admin",
        title: member.title || "Site Administrator",
        active: true,
      });
    }
    return member;
  }

  try {
    return await createMemberRecord({
      email: normalizedEmail,
      fullName: memberDisplayName(normalizedEmail, displayName),
      role: "super_admin",
      title: "Site Administrator",
      chapter: "National",
      active: true,
    });
  } catch (error) {
    member = await findMemberRecordByEmail(normalizedEmail);
    if (member) return member;
    throw error;
  }
}

function bootstrapSuperAdminEmails() {
  const emails = new Set(
    (process.env.PORTAL_SUPER_ADMIN_EMAILS ?? "")
      .split(/[\s,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  if (process.env.NODE_ENV !== "production") emails.add("portal-preview@localhost.invalid");
  return emails;
}

function memberDisplayName(email: string, displayName?: string) {
  const candidate = displayName?.trim();
  if (candidate && candidate.toLowerCase() !== email) return candidate;

  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Site Administrator";
}

async function bindStableUserId(member: MemberRecord, user: PortalUser) {
  if (member.userId === user.userId) return member;
  return updateMemberRecord(member.id, { userId: user.userId });
}

export async function getAuthenticatedMember() {
  const user = await getPortalUser();
  if (!user) return { user: null, member: null };

  const member = await findMemberByEmail(user.email, user.displayName);
  if (!member?.active) return { user, member: null };
  return { user, member: await bindStableUserId(member, user) };
}

export async function requireActiveMember(returnTo: string) {
  const user = await requirePortalUser(returnTo);
  let member: MemberRecord | undefined;
  try {
    member = await findMemberByEmail(user.email, user.displayName);
  } catch {
    redirect("/members?data_error=configuration");
  }
  if (!member?.active) redirect("/members");
  return { user, member: await bindStableUserId(member, user) };
}

export async function requireMemberManager(returnTo: string) {
  const session = await requireActiveMember(returnTo);
  if (!canManageMembers(session.member.role)) redirect("/members");
  return session;
}
