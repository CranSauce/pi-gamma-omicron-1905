"use client";

import { useState, type FormEvent } from "react";

export function DiscussionComposer() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body: form.get("body"),
        category: form.get("category"),
      }),
    });
    const result = await response.json() as { error?: string; id?: string };
    if (!response.ok || !result.id) {
      setMessage(result.error || "The discussion could not be created.");
      setSubmitting(false);
      return;
    }

    window.location.assign(`/members/discuss/${result.id}`);
  }

  if (!open) {
    return <button className="button button--scarlet" type="button" onClick={() => setOpen(true)}>Start a discussion</button>;
  }

  return (
    <form className="portal-composer discussion-composer" onSubmit={submit}>
      <div className="portal-composer__heading">
        <span>New thread</span>
        <h2>Start a conversation</h2>
      </div>
      <label>
        Category
        <select name="category" defaultValue="brotherhood">
          <option value="brotherhood">Brotherhood</option>
          <option value="chapter">Chapter operations</option>
          <option value="service">Service and community</option>
          <option value="scholarship">Scholarship and careers</option>
          <option value="events">Events</option>
          <option value="history">History and archives</option>
        </select>
      </label>
      <label>
        Discussion title
        <input name="title" required maxLength={160} placeholder="What should the brotherhood discuss?" />
      </label>
      <label>
        Opening message
        <textarea name="body" required maxLength={6000} placeholder="Add context, a question, or a proposed next step." />
      </label>
      <div className="portal-composer__submit">
        <button className="button button--scarlet" disabled={submitting} type="submit">{submitting ? "Creating…" : "Create discussion"}</button>
        <button className="portal-text-button" type="button" onClick={() => setOpen(false)}>Cancel</button>
        {message && <p role="alert">{message}</p>}
      </div>
    </form>
  );
}
