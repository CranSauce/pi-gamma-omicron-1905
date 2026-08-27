import { createSupabaseAdminClient } from "./supabase/server";

export type MemberRecord = {
  id: number;
  email: string;
  fullName: string;
  userId: string;
  role: string;
  title: string;
  chapter: string;
  location: string;
  bio: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InterestRecord = {
  id: string;
  fullName: string;
  email: string;
  institution: string;
  institutionType: string;
  chapterInterest: string;
  currentStatus: string;
  whyInterested: string;
  status: string;
  createdAt: string;
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  audience: string;
  createdAt: string;
  author: string;
  authorTitle: string;
};

export type DiscussionThreadRecord = {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorTitle: string;
};

export type DiscussionReplyRecord = {
  id: string;
  threadId: string;
  body: string;
  createdAt: string;
  author: string;
  authorTitle: string;
  authorRole: string;
};

type RawMember = {
  id: number;
  email: string;
  full_name: string;
  user_id: string | null;
  role: string;
  title: string;
  chapter: string;
  location: string;
  bio: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type RawInterest = {
  id: string;
  full_name: string;
  email: string;
  institution: string;
  institution_type: string;
  chapter_interest: string;
  current_status: string;
  why_interested: string;
  status: string;
  created_at: string;
};

type RawAnnouncement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  author_member_id: number;
  created_at: string;
};

type RawThread = {
  id: string;
  title: string;
  body: string;
  category: string;
  author_member_id: number;
  pinned: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
};

type RawReply = {
  id: string;
  thread_id: string;
  author_member_id: number;
  body: string;
  created_at: string;
};

type AuthorIdentity = { fullName: string; title: string; role: string };

export async function createInterest(input: {
  id: string;
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  institution: string;
  institutionType: string;
  fieldOfStudy: string;
  graduationYear: string;
  currentStatus: string;
  chapterInterest: string;
  whyInterested: string;
  brotherhoodMeaning: string;
  referralSource: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("interests").insert({
    id: input.id,
    full_name: input.fullName,
    preferred_name: input.preferredName,
    email: input.email,
    phone: input.phone,
    city: input.city,
    state: input.state,
    institution: input.institution,
    institution_type: input.institutionType,
    field_of_study: input.fieldOfStudy,
    graduation_year: input.graduationYear,
    current_status: input.currentStatus,
    chapter_interest: input.chapterInterest,
    why_interested: input.whyInterested,
    brotherhood_meaning: input.brotherhoodMeaning,
    referral_source: input.referralSource,
  });
  throwIfError(error, "Interest submission could not be saved");
}

export async function listInterests(limit = 100): Promise<InterestRecord[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("interests")
    .select("id,full_name,email,institution,institution_type,chapter_interest,current_status,why_interested,status,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  throwIfError(error, "Interest queue could not be loaded");
  return ((data ?? []) as RawInterest[]).map(mapInterest);
}

export async function countNewInterests() {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("interests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  throwIfError(error, "Interest count could not be loaded");
  return count ?? 0;
}

export async function updateInterestStatus(id: string, status: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("interests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  throwIfError(error, "Interest record could not be updated");
}

export async function findMemberRecordByEmail(email: string): Promise<MemberRecord | undefined> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  throwIfError(error, "Member lookup failed");
  return data ? mapMember(data as RawMember) : undefined;
}

export async function findMemberRecordById(id: number): Promise<MemberRecord | undefined> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("members").select("*").eq("id", id).maybeSingle();
  throwIfError(error, "Member lookup failed");
  return data ? mapMember(data as RawMember) : undefined;
}

export async function createMemberRecord(input: {
  email: string;
  fullName: string;
  role: string;
  title?: string;
  chapter?: string;
  location?: string;
  active?: boolean;
}): Promise<MemberRecord> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .insert({
      email: input.email.trim().toLowerCase(),
      full_name: input.fullName,
      role: input.role,
      title: input.title ?? "",
      chapter: input.chapter ?? "",
      location: input.location ?? "",
      active: input.active ?? true,
    })
    .select("*")
    .single();
  throwIfError(error, "Member record could not be created");
  return mapMember(data as RawMember);
}

export async function updateMemberRecord(
  id: number,
  input: Partial<{
    userId: string;
    role: string;
    title: string;
    chapter: string;
    location: string;
    bio: string;
    active: boolean;
  }>,
): Promise<MemberRecord> {
  const update: Record<string, string | boolean> = { updated_at: new Date().toISOString() };
  if (input.userId !== undefined) update.user_id = input.userId;
  if (input.role !== undefined) update.role = input.role;
  if (input.title !== undefined) update.title = input.title;
  if (input.chapter !== undefined) update.chapter = input.chapter;
  if (input.location !== undefined) update.location = input.location;
  if (input.bio !== undefined) update.bio = input.bio;
  if (input.active !== undefined) update.active = input.active;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("members").update(update).eq("id", id).select("*").single();
  throwIfError(error, "Member record could not be updated");
  return mapMember(data as RawMember);
}

export async function listAllMembers(): Promise<MemberRecord[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("active", { ascending: false })
    .order("full_name", { ascending: true });
  throwIfError(error, "Member records could not be loaded");
  return ((data ?? []) as RawMember[]).map(mapMember);
}

export async function listActiveMembers(): Promise<MemberRecord[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("active", true)
    .order("chapter", { ascending: true })
    .order("full_name", { ascending: true });
  throwIfError(error, "Member directory could not be loaded");
  return ((data ?? []) as RawMember[]).map(mapMember);
}

export async function countActiveMembers() {
  const supabase = createSupabaseAdminClient();
  const { count, error } = await supabase
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  throwIfError(error, "Member count could not be loaded");
  return count ?? 0;
}

export async function createAnnouncement(input: {
  id: string;
  title: string;
  body: string;
  audience: string;
  authorMemberId: number;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("announcements").insert({
    id: input.id,
    title: input.title,
    body: input.body,
    audience: input.audience,
    author_member_id: input.authorMemberId,
  });
  throwIfError(error, "Announcement could not be published");
}

export async function listAnnouncements(audiences: string[], limit?: number): Promise<AnnouncementRecord[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("announcements")
    .select("id,title,body,audience,author_member_id,created_at")
    .eq("published", true)
    .in("audience", audiences)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  throwIfError(error, "Announcements could not be loaded");
  const rows = (data ?? []) as RawAnnouncement[];
  const authors = await loadAuthors(rows.map((row) => row.author_member_id));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    createdAt: row.created_at,
    author: authors.get(row.author_member_id)?.fullName ?? "",
    authorTitle: authors.get(row.author_member_id)?.title ?? "",
  }));
}

export async function createDiscussionThread(input: {
  id: string;
  title: string;
  body: string;
  category: string;
  authorMemberId: number;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("discussion_threads").insert({
    id: input.id,
    title: input.title,
    body: input.body,
    category: input.category,
    author_member_id: input.authorMemberId,
  });
  throwIfError(error, "Discussion could not be created");
}

export async function listDiscussionThreads(limit?: number): Promise<DiscussionThreadRecord[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("discussion_threads")
    .select("id,title,body,category,author_member_id,pinned,locked,created_at,updated_at")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  throwIfError(error, "Discussions could not be loaded");
  return addThreadAuthors((data ?? []) as RawThread[]);
}

export async function findDiscussionThread(id: string): Promise<DiscussionThreadRecord | undefined> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("discussion_threads")
    .select("id,title,body,category,author_member_id,pinned,locked,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();
  throwIfError(error, "Discussion could not be loaded");
  if (!data) return undefined;
  return (await addThreadAuthors([data as RawThread]))[0];
}

export async function listDiscussionReplies(threadId?: string): Promise<DiscussionReplyRecord[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("discussion_replies")
    .select("id,thread_id,author_member_id,body,created_at")
    .order("created_at", { ascending: true });
  if (threadId) query = query.eq("thread_id", threadId);
  const { data, error } = await query;
  throwIfError(error, "Discussion replies could not be loaded");
  const rows = (data ?? []) as RawReply[];
  const authors = await loadAuthors(rows.map((row) => row.author_member_id));
  return rows.map((row) => ({
    id: row.id,
    threadId: row.thread_id,
    body: row.body,
    createdAt: row.created_at,
    author: authors.get(row.author_member_id)?.fullName ?? "",
    authorTitle: authors.get(row.author_member_id)?.title ?? "",
    authorRole: authors.get(row.author_member_id)?.role ?? "",
  }));
}

export async function createDiscussionReply(input: {
  id: string;
  threadId: string;
  authorMemberId: number;
  body: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error: replyError } = await supabase.from("discussion_replies").insert({
    id: input.id,
    thread_id: input.threadId,
    author_member_id: input.authorMemberId,
    body: input.body,
  });
  throwIfError(replyError, "Reply could not be posted");

  const { error: threadError } = await supabase
    .from("discussion_threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", input.threadId);
  throwIfError(threadError, "Discussion activity could not be updated");
}

async function addThreadAuthors(rows: RawThread[]): Promise<DiscussionThreadRecord[]> {
  const authors = await loadAuthors(rows.map((row) => row.author_member_id));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    pinned: row.pinned,
    locked: row.locked,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    author: authors.get(row.author_member_id)?.fullName ?? "",
    authorTitle: authors.get(row.author_member_id)?.title ?? "",
  }));
}

async function loadAuthors(ids: number[]) {
  const uniqueIds = [...new Set(ids)];
  const identities = new Map<number, AuthorIdentity>();
  if (!uniqueIds.length) return identities;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("members")
    .select("id,full_name,title,role")
    .in("id", uniqueIds);
  throwIfError(error, "Member attribution could not be loaded");
  for (const row of data ?? []) {
    identities.set(row.id as number, {
      fullName: row.full_name as string,
      title: row.title as string,
      role: row.role as string,
    });
  }
  return identities;
}

function mapMember(row: RawMember): MemberRecord {
  return {
    id: Number(row.id),
    email: row.email,
    fullName: row.full_name,
    userId: row.user_id ?? "",
    role: row.role,
    title: row.title,
    chapter: row.chapter,
    location: row.location,
    bio: row.bio,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInterest(row: RawInterest): InterestRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    institution: row.institution,
    institutionType: row.institution_type,
    chapterInterest: row.chapter_interest,
    currentStatus: row.current_status,
    whyInterested: row.why_interested,
    status: row.status,
    createdAt: row.created_at,
  };
}

function throwIfError(error: { message: string } | null, context: string): asserts error is null {
  if (error) throw new Error(`${context}: ${error.message}`);
}
