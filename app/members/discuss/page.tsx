import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "../../../db";
import { discussionReplies, discussionThreads, members } from "../../../db/schema";
import { canUseDiscussionBoard, requireActiveMember } from "../../../lib/member-access";
import { PortalShell } from "../components/PortalShell";
import { DiscussionComposer } from "./DiscussionComposer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brotherhood Board",
  description: "Private Pi Gamma Omicron member discussion board.",
  robots: { index: false, follow: false },
};

export default async function DiscussionBoardPage() {
  const { member } = await requireActiveMember("/members/discuss");
  if (!canUseDiscussionBoard(member.role)) redirect("/members");

  const db = getDb();
  const [threads, replies] = await Promise.all([
    db
      .select({
        id: discussionThreads.id,
        title: discussionThreads.title,
        body: discussionThreads.body,
        category: discussionThreads.category,
        pinned: discussionThreads.pinned,
        locked: discussionThreads.locked,
        createdAt: discussionThreads.createdAt,
        updatedAt: discussionThreads.updatedAt,
        author: members.fullName,
        authorTitle: members.title,
      })
      .from(discussionThreads)
      .leftJoin(members, eq(discussionThreads.authorMemberId, members.id))
      .orderBy(desc(discussionThreads.pinned), desc(discussionThreads.updatedAt)),
    db.select({ threadId: discussionReplies.threadId }).from(discussionReplies),
  ]);
  const replyCounts = replies.reduce<Record<string, number>>((counts, reply) => {
    counts[reply.threadId] = (counts[reply.threadId] || 0) + 1;
    return counts;
  }, {});

  return (
    <PortalShell member={member} active="discuss">
      <header className="portal-page-header portal-page-header--compact">
        <div>
          <p className="section-label">Private member forum</p>
          <h1>Brotherhood board</h1>
        </div>
        <div className="portal-page-header__action"><DiscussionComposer /></div>
      </header>

      <section className="discussion-board" aria-label="Member discussions">
        <div className="discussion-board__labels" aria-hidden="true"><span>Conversation</span><span>Activity</span></div>
        {threads.length ? threads.map((thread) => (
          <a className="discussion-thread-card" href={`/members/discuss/${thread.id}`} key={thread.id}>
            <div>
              <p>
                <span>{thread.category}</span>
                {thread.pinned && <strong>Pinned</strong>}
                {thread.locked && <strong>Locked</strong>}
              </p>
              <h2>{thread.title}</h2>
              <p>{thread.body}</p>
              <small>{thread.author || "Member"}{thread.authorTitle ? ` · ${thread.authorTitle}` : ""}</small>
            </div>
            <div>
              <strong>{replyCounts[thread.id] || 0}</strong>
              <span>Replies</span>
              <time>{formatDate(thread.updatedAt)}</time>
            </div>
          </a>
        )) : (
          <div className="portal-empty portal-empty--large"><strong>The board is open.</strong><p>Create the first conversation for the brotherhood.</p></div>
        )}
      </section>
    </PortalShell>
  );
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
