import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "../../../../db";
import { discussionReplies, discussionThreads, members } from "../../../../db/schema";
import { canUseDiscussionBoard, requireActiveMember } from "../../../../lib/member-access";
import { PortalShell } from "../../components/PortalShell";
import { ReplyComposer } from "./ReplyComposer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Member Discussion",
  description: "A private Pi Gamma Omicron member discussion.",
  robots: { index: false, follow: false },
};

export default async function DiscussionThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const { member } = await requireActiveMember(`/members/discuss/${encodeURIComponent(threadId)}`);
  if (!canUseDiscussionBoard(member.role)) redirect("/members");

  const db = getDb();
  const [thread] = await db
    .select({
      id: discussionThreads.id,
      title: discussionThreads.title,
      body: discussionThreads.body,
      category: discussionThreads.category,
      locked: discussionThreads.locked,
      createdAt: discussionThreads.createdAt,
      author: members.fullName,
      authorTitle: members.title,
    })
    .from(discussionThreads)
    .leftJoin(members, eq(discussionThreads.authorMemberId, members.id))
    .where(eq(discussionThreads.id, threadId))
    .limit(1);
  if (!thread) redirect("/members/discuss");

  const replies = await db
    .select({
      id: discussionReplies.id,
      body: discussionReplies.body,
      createdAt: discussionReplies.createdAt,
      author: members.fullName,
      authorTitle: members.title,
      authorRole: members.role,
    })
    .from(discussionReplies)
    .leftJoin(members, eq(discussionReplies.authorMemberId, members.id))
    .where(eq(discussionReplies.threadId, threadId))
    .orderBy(asc(discussionReplies.createdAt));

  return (
    <PortalShell member={member} active="discuss">
      <article className="discussion-detail">
        <Link className="portal-back-link" href="/members/discuss">← Brotherhood board</Link>
        <header>
          <p><span>{thread.category}</span><time>{formatDate(thread.createdAt)}</time></p>
          <h1>{thread.title}</h1>
          <small>Started by {thread.author || "Member"}{thread.authorTitle ? ` · ${thread.authorTitle}` : ""}</small>
        </header>
        <div className="discussion-detail__opening">{thread.body}</div>
      </article>

      <section className="discussion-replies" aria-labelledby="discussion-replies-title">
        <div className="portal-panel__heading">
          <div><span>{String(replies.length).padStart(2, "0")}</span><h2 id="discussion-replies-title">Replies</h2></div>
        </div>
        {replies.map((reply, index) => (
          <article key={reply.id}>
            <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{reply.author || "Member"}</strong><small>{reply.authorTitle || reply.authorRole?.replaceAll("_", " ")}</small></div>
            <p>{reply.body}</p>
            <time>{formatDate(reply.createdAt)}</time>
          </article>
        ))}
      </section>

      {thread.locked ? <div className="portal-empty"><strong>This discussion is locked.</strong><p>Replies have been closed by an officer.</p></div> : <ReplyComposer threadId={thread.id} />}
    </PortalShell>
  );
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
