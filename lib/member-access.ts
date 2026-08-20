import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { getDb } from "../db";
import { members } from "../db/schema";
import {
  getChatGPTUser,
  requireChatGPTUser,
  type ChatGPTUser,
} from "../app/chatgpt-auth";

export const memberRoles = [
  "super_admin",
  "national_officer",
  "chapter_officer",
  "brother",
  "alumni",
  "applicant",
] as const;

export type MemberRole = (typeof memberRoles)[number];
export type MemberRecord = typeof members.$inferSelect;

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
  const db = getDb();
  let [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, normalizedEmail))
    .limit(1);

  if (!bootstrapSuperAdminEmails().has(normalizedEmail)) return member;

  const updatedAt = new Date().toISOString();
  if (member) {
    if (member.role !== "super_admin" || !member.active) {
      await db
        .update(members)
        .set({
          role: "super_admin",
          title: member.title || "Site Administrator",
          active: true,
          updatedAt,
        })
        .where(eq(members.id, member.id));
      member = {
        ...member,
        role: "super_admin",
        title: member.title || "Site Administrator",
        active: true,
        updatedAt,
      };
    }
    return member;
  }

  await db
    .insert(members)
    .values({
      email: normalizedEmail,
      fullName: memberDisplayName(normalizedEmail, displayName),
      role: "super_admin",
      title: "Site Administrator",
      chapter: "National",
      active: true,
    })
    .onConflictDoNothing({ target: members.email });

  [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, normalizedEmail))
    .limit(1);
  return member;
}

function bootstrapSuperAdminEmails() {
  const rawValue = (env as unknown as Record<string, unknown>)[
    "PORTAL_SUPER_ADMIN_EMAILS"
  ];
  const emails = new Set(
    (typeof rawValue === "string" ? rawValue : "")
      .split(/[\s,;]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  if (process.env.NODE_ENV !== "production") {
    emails.add("portal-preview@localhost.invalid");
  }
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

async function bindStableUserId(member: MemberRecord, user: ChatGPTUser) {
  if (member.userId === user.userId) return member;

  const db = getDb();
  await db
    .update(members)
    .set({ userId: user.userId, updatedAt: new Date().toISOString() })
    .where(eq(members.id, member.id));
  return { ...member, userId: user.userId };
}

export async function getAuthenticatedMember() {
  const user = await getChatGPTUser();
  if (!user) return { user: null, member: null };

  const member = await findMemberByEmail(user.email, user.displayName);
  if (!member?.active) return { user, member: null };

  return { user, member: await bindStableUserId(member, user) };
}

export async function requireActiveMember(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  const member = await findMemberByEmail(user.email, user.displayName);
  if (!member?.active) redirect("/members");

  return { user, member: await bindStableUserId(member, user) };
}

export async function requireMemberManager(returnTo: string) {
  const session = await requireActiveMember(returnTo);
  if (!canManageMembers(session.member.role)) redirect("/members");
  return session;
}
