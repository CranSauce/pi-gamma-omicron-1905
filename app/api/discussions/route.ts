import { getDb } from "../../../db";
import { discussionThreads } from "../../../db/schema";
import { canUseDiscussionBoard, getAuthenticatedMember } from "../../../lib/member-access";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const categories = new Set(["brotherhood", "chapter", "service", "scholarship", "events", "history"]);

export async function POST(request: Request) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canUseDiscussionBoard(session.member.role)) {
    return Response.json({ error: "Active fraternal membership is required." }, { status: 403 });
  }

  const payload = await request.json() as Record<string, unknown>;
  const title = clean(payload.title, 160);
  const body = clean(payload.body, 6000);
  const requestedCategory = clean(payload.category, 40);
  if (!title || !body) return Response.json({ error: "A title and opening message are required." }, { status: 400 });

  const id = crypto.randomUUID();
  await getDb().insert(discussionThreads).values({
    id,
    title,
    body,
    category: categories.has(requestedCategory) ? requestedCategory : "brotherhood",
    authorMemberId: session.member.id,
  });

  return Response.json({ id }, { status: 201 });
}
