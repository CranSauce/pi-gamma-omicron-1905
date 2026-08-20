"use client";

import { useState, type FormEvent } from "react";

export function AnnouncementComposer({ chapter }: { chapter: string }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");

    const form = new FormData(formElement);
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        body: form.get("body"),
        audience: form.get("audience"),
      }),
    });
    const result = await response.json() as { error?: string };

    if (!response.ok) {
      setMessage(result.error || "The announcement could not be published.");
      setSubmitting(false);
      return;
    }

    formElement.reset();
    window.location.reload();
  }

  return (
    <form className="portal-composer" onSubmit={submit}>
      <div className="portal-composer__heading">
        <span>Officer publishing</span>
        <h2>Post an announcement</h2>
      </div>
      <label>
        Title
        <input name="title" required maxLength={140} placeholder="Meeting notice, service opportunity…" />
      </label>
      <label>
        Message
        <textarea name="body" required maxLength={4000} placeholder="Write the complete notice for members." />
      </label>
      <label>
        Audience
        <select name="audience" defaultValue="all">
          <option value="all">All active members</option>
          <option value="officers">Officers only</option>
          {chapter && <option value="chapter">{chapter} only</option>}
        </select>
      </label>
      <div className="portal-composer__submit">
        <button className="button button--scarlet" disabled={submitting} type="submit">
          {submitting ? "Publishing…" : "Publish announcement"}
        </button>
        {message && <p role="alert">{message}</p>}
      </div>
    </form>
  );
}
