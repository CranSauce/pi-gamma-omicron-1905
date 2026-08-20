import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const interests = sqliteTable(
  "interests",
  {
    id: text("id").primaryKey(),
    fullName: text("full_name").notNull(),
    preferredName: text("preferred_name").notNull().default(""),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    city: text("city").notNull(),
    state: text("state").notNull(),
    institution: text("institution").notNull(),
    institutionType: text("institution_type").notNull(),
    fieldOfStudy: text("field_of_study").notNull().default(""),
    graduationYear: text("graduation_year").notNull().default(""),
    currentStatus: text("current_status").notNull(),
    chapterInterest: text("chapter_interest").notNull(),
    whyInterested: text("why_interested").notNull(),
    brotherhoodMeaning: text("brotherhood_meaning").notNull(),
    referralSource: text("referral_source").notNull().default(""),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_interests_status_created_at").on(table.status, table.createdAt),
    index("idx_interests_email").on(table.email),
  ],
);

export const members = sqliteTable(
  "members",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    userId: text("user_id").notNull().default(""),
    role: text("role").notNull().default("brother"),
    title: text("title").notNull().default(""),
    chapter: text("chapter").notNull().default(""),
    location: text("location").notNull().default(""),
    bio: text("bio").notNull().default(""),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_members_email_unique").on(table.email),
    index("idx_members_active_chapter").on(table.active, table.chapter),
    index("idx_members_role_active").on(table.role, table.active),
  ],
);

export const announcements = sqliteTable(
  "announcements",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    audience: text("audience").notNull().default("all"),
    authorMemberId: integer("author_member_id")
      .notNull()
      .references(() => members.id),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_announcements_published_created_at").on(table.published, table.createdAt),
    index("idx_announcements_audience_created_at").on(table.audience, table.createdAt),
  ],
);

export const discussionThreads = sqliteTable(
  "discussion_threads",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    category: text("category").notNull().default("brotherhood"),
    authorMemberId: integer("author_member_id")
      .notNull()
      .references(() => members.id),
    pinned: integer("pinned", { mode: "boolean" }).notNull().default(false),
    locked: integer("locked", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_discussion_threads_pinned_created_at").on(table.pinned, table.createdAt),
    index("idx_discussion_threads_author_member_id").on(table.authorMemberId),
  ],
);

export const discussionReplies = sqliteTable(
  "discussion_replies",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => discussionThreads.id, { onDelete: "cascade" }),
    authorMemberId: integer("author_member_id")
      .notNull()
      .references(() => members.id),
    body: text("body").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_discussion_replies_thread_created_at").on(table.threadId, table.createdAt)],
);
