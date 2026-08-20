import { eq } from "drizzle-orm";
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

export async function findMemberByEmail(email: string) {
  const db = getDb();
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, email.trim().toLowerCase()))
    .limit(1);
  return member;
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

  const member = await findMemberByEmail(user.email);
  if (!member?.active) return { user, member: null };

  return { user, member: await bindStableUserId(member, user) };
}

export async function requireActiveMember(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  const member = await findMemberByEmail(user.email);
  if (!member?.active) redirect("/members");

  return { user, member: await bindStableUserId(member, user) };
}

export async function requireMemberManager(returnTo: string) {
  const session = await requireActiveMember(returnTo);
  if (!canManageMembers(session.member.role)) redirect("/members");
  return session;
}
