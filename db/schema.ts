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
    role: text("role").notNull().default("member"),
    chapter: text("chapter").notNull().default(""),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [uniqueIndex("idx_members_email_unique").on(table.email)],
);
