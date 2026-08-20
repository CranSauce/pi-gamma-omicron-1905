"use client";

import { useState, type FormEvent } from "react";

type MemberRow = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  title: string;
  chapter: string;
  location: string;
  bio: string;
  active: boolean;
};

type InterestRow = {
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

const roles = [
  ["super_admin", "Super administrator"],
  ["national_officer", "National officer"],
  ["chapter_officer", "Chapter officer"],
  ["brother", "Brother"],
  ["alumni", "Alumni"],
  ["applicant", "Applicant"],
] as const;

export function AdministrationPanels({
  memberRows,
  interestRows,
  currentRole,
}: {
  memberRows: MemberRow[];
  interestRows: InterestRow[];
  currentRole: string;
}) {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setNotice(result.error || "The member could not be added.");
      setBusy(false);
      return;
    }
    window.location.reload();
  }

  async function updateMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    const id = String(form.get("id"));
    const payload = Object.fromEntries(form.entries());
    payload.active = form.get("active") ? "true" : "false";
    const response = await fetch(`/api/members/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setNotice(result.error || "The member could not be updated.");
      setBusy(false);
      return;
    }
    setNotice("Member record updated.");
    setBusy(false);
  }

  async function updateInterest(id: string, status: string) {
    setBusy(true);
    setNotice("");
    const response = await fetch(`/api/interests/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setNotice(result.error || "The interest record could not be updated.");
      setBusy(false);
      return;
    }
    window.location.reload();
  }

  return (
    <>
      <section className="admin-section" aria-labelledby="add-member-title">
        <div className="admin-section__heading">
          <p className="section-label">Membership authority</p>
          <h2 id="add-member-title">Add an authorized account</h2>
          <p>Access is granted by email. On first sign-in, the account is bound to that member’s stable identity.</p>
        </div>
        <form className="admin-add-member" onSubmit={addMember}>
          <label>Full name<input name="fullName" required maxLength={120} /></label>
          <label>Email<input name="email" type="email" required maxLength={254} /></label>
          <label>
            Role
            <select name="role" defaultValue="brother">
              {roles.filter(([value]) => currentRole === "super_admin" || value !== "super_admin").map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>Officer title<input name="title" maxLength={120} placeholder="Vice President, Chapter Secretary…" /></label>
          <label>Chapter<input name="chapter" maxLength={120} placeholder="Alpha Chapter" /></label>
          <label>Location<input name="location" maxLength={120} placeholder="Columbus, Ohio" /></label>
          <button className="button button--scarlet" disabled={busy} type="submit">{busy ? "Saving…" : "Authorize member"}</button>
        </form>
      </section>

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <section className="admin-section" aria-labelledby="manage-members-title">
        <div className="admin-section__heading">
          <p className="section-label">Active and pending accounts</p>
          <h2 id="manage-members-title">Manage members</h2>
          <p>Update role, chapter placement, directory information, and portal access.</p>
        </div>
        <div className="admin-member-list">
          {memberRows.map((member) => (
            <form key={member.id} onSubmit={updateMember}>
              <input type="hidden" name="id" value={member.id} />
              <header><div className="member-directory__monogram" aria-hidden="true">{initials(member.fullName)}</div><div><strong>{member.fullName}</strong><span>{member.email}</span></div></header>
              <div className="admin-member-list__fields">
                <label>Role<select name="role" defaultValue={member.role}>{roles.filter(([value]) => currentRole === "super_admin" || value !== "super_admin").map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label>Title<input name="title" defaultValue={member.title} maxLength={120} /></label>
                <label>Chapter<input name="chapter" defaultValue={member.chapter} maxLength={120} /></label>
                <label>Location<input name="location" defaultValue={member.location} maxLength={120} /></label>
                <label className="admin-member-list__bio">Bio<textarea name="bio" defaultValue={member.bio} maxLength={1200} /></label>
                <label className="admin-member-list__active"><input name="active" type="checkbox" defaultChecked={member.active} /> Portal access active</label>
              </div>
              <button className="portal-text-button" disabled={busy} type="submit">Save member</button>
            </form>
          ))}
        </div>
      </section>

      <section className="admin-section" aria-labelledby="interest-queue-title">
        <div className="admin-section__heading">
          <p className="section-label">Recruitment workflow</p>
          <h2 id="interest-queue-title">Interest queue</h2>
          <p>Move submissions from initial review through conversation, decision, and membership onboarding.</p>
        </div>
        <div className="interest-review-list">
          {interestRows.length ? interestRows.map((interest) => (
            <article key={interest.id}>
              <header><div><span>{interest.status}</span><h3>{interest.fullName}</h3><p>{interest.email}</p></div><time>{formatDate(interest.createdAt)}</time></header>
              <dl>
                <div><dt>Institution</dt><dd>{interest.institution} · {interest.institutionType}</dd></div>
                <div><dt>Current status</dt><dd>{interest.currentStatus}</dd></div>
                <div><dt>Chapter interest</dt><dd>{interest.chapterInterest}</dd></div>
              </dl>
              <details><summary>Read statement</summary><p>{interest.whyInterested}</p></details>
              <label>
                Application stage
                <select value={interest.status} disabled={busy} onChange={(event) => updateInterest(interest.id, event.target.value)}>
                  <option value="new">New</option>
                  <option value="under_review">Under review</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </article>
          )) : <div className="portal-empty"><strong>No submissions yet.</strong><p>Public interest forms will enter this review queue automatically.</p></div>}
        </div>
      </section>
    </>
  );
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "Π";
}

function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}
