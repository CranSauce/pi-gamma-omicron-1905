import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { members } from "../../../../db/schema";
import {
  canManageMembers,
  getAuthenticatedMember,
  isMemberRole,
} from "../../../../lib/member-access";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ memberId: string }> }) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canManageMembers(session.member.role)) {
    return Response.json({ error: "National membership authority is required." }, { status: 403 });
  }

  const { memberId } = await params;
  const id = Number(memberId);
  if (!Number.isSafeInteger(id) || id < 1) return Response.json({ error: "Invalid member record." }, { status: 400 });

  const payload = await request.json() as Record<string, unknown>;
  const role = clean(payload.role, 40);
  if (!isMemberRole(role)) return Response.json({ error: "Select a valid member role." }, { status: 400 });

  const db = getDb();
  const [target] = await db.select().from(members).where(eq(members.id, id)).limit(1);
  if (!target) return Response.json({ error: "Member not found." }, { status: 404 });
  if ((target.role === "super_admin" || role === "super_admin") && session.member.role !== "super_admin") {
    return Response.json({ error: "Only a super administrator may change that record." }, { status: 403 });
  }

  const active = payload.active === true || payload.active === "true";
  if (target.id === session.member.id && !active) {
    return Response.json({ error: "You cannot deactivate your own account." }, { status: 409 });
  }

  await db.update(members).set({
    role,
    title: clean(payload.title, 120),
    chapter: clean(payload.chapter, 120),
    location: clean(payload.location, 120),
    bio: clean(payload.bio, 1200),
    active,
    updatedAt: new Date().toISOString(),
  }).where(eq(members.id, id));

  return Response.json({ message: "Member updated." });
}
