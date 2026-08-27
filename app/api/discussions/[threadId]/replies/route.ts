import { canUseDiscussionBoard, getAuthenticatedMember } from "../../../../../lib/member-access";
import { createDiscussionReply, findDiscussionThread } from "../../../../../lib/portal-data";

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

  const thread = await findDiscussionThread(threadId);
  if (!thread) return Response.json({ error: "Discussion not found." }, { status: 404 });
  if (thread.locked) return Response.json({ error: "This discussion is locked." }, { status: 409 });

  await createDiscussionReply({
    id: crypto.randomUUID(),
    threadId,
    authorMemberId: session.member.id,
    body,
  });

  return Response.json({ message: "Reply posted." }, { status: 201 });
}
