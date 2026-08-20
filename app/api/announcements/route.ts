import { getDb } from "../../../db";
import { announcements } from "../../../db/schema";
import { canPublishAnnouncements, getAuthenticatedMember } from "../../../lib/member-access";

type AnnouncementPayload = {
  title?: unknown;
  body?: unknown;
  audience?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canPublishAnnouncements(session.member.role)) {
    return Response.json({ error: "Officer publishing access is required." }, { status: 403 });
  }

  const payload = await request.json() as AnnouncementPayload;
  const title = clean(payload.title, 140);
  const body = clean(payload.body, 4000);
  const requestedAudience = clean(payload.audience, 80);
  if (!title || !body) return Response.json({ error: "A title and message are required." }, { status: 400 });

  let audience = "all";
  if (requestedAudience === "officers") audience = "officers";
  if (requestedAudience === "chapter" && session.member.chapter) audience = `chapter:${session.member.chapter}`;

  await getDb().insert(announcements).values({
    id: crypto.randomUUID(),
    title,
    body,
    audience,
    authorMemberId: session.member.id,
  });

  return Response.json({ message: "Announcement published." }, { status: 201 });
}
