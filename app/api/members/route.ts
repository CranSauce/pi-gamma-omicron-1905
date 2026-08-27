import {
  canManageMembers,
  getAuthenticatedMember,
  isMemberRole,
} from "../../../lib/member-access";
import { createMemberRecord, findMemberRecordByEmail } from "../../../lib/portal-data";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canManageMembers(session.member.role)) {
    return Response.json({ error: "National membership authority is required." }, { status: 403 });
  }

  const payload = await request.json() as Record<string, unknown>;
  const email = clean(payload.email, 254).toLowerCase();
  const fullName = clean(payload.fullName, 120);
  const role = clean(payload.role, 40);
  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A valid name and email are required." }, { status: 400 });
  }
  if (!isMemberRole(role)) return Response.json({ error: "Select a valid member role." }, { status: 400 });
  if (role === "super_admin" && session.member.role !== "super_admin") {
    return Response.json({ error: "Only a super administrator may grant that role." }, { status: 403 });
  }

  const existing = await findMemberRecordByEmail(email);
  if (existing) return Response.json({ error: "That email already has a member record." }, { status: 409 });

  await createMemberRecord({
    email,
    fullName,
    role,
    title: clean(payload.title, 120),
    chapter: clean(payload.chapter, 120),
    location: clean(payload.location, 120),
  });

  return Response.json({ message: "Member authorized." }, { status: 201 });
}
