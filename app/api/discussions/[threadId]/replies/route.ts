import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { discussionReplies, discussionThreads } from "../../../../../db/schema";
import { canUseDiscussionBoard, getAuthenticatedMember } from "../../../../../lib/member-access";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  const session = await getAuthenticatedMember();
  if (!session.user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  if (!session.member || !canUseDiscussionBoard(session.member.role)) {
    return Response.json({ error: "Active fraternal membership is required." }, { status: 403 });
  }

  const { threadId } = await params;
  const payload = await request.json() as Record<string, unknown>;
  const body = clean(payload.body, 5000);
  if (!body) return Response.json({ error: "A reply is required." }, { status: 400 });

  const db = getDb();
  const [thread] = await db.select({ id: discussionThreads.id, locked: discussionThreads.locked })
    .from(discussionThreads)
    .where(eq(discussionThreads.id, threadId))
    .limit(1);
  if (!thread) return Response.json({ error: "Discussion not found." }, { status: 404 });
  if (thread.locked) return Response.json({ error: "This discussion is locked." }, { status: 409 });

  await db.batch([
    db.insert(discussionReplies).values({
      id: crypto.randomUUID(),
      threadId,
      authorMemberId: session.member.id,
      body,
    }),
    db.update(discussionThreads).set({ updatedAt: new Date().toISOString() }).where(eq(discussionThreads.id, threadId)),
  ]);

  return Response.json({ message: "Reply posted." }, { status: 201 });
}
