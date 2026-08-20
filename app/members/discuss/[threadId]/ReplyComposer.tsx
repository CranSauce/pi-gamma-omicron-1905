"use client";

import { useState, type FormEvent } from "react";

export function ReplyComposer({ threadId }: { threadId: string }) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setMessage("");
    const form = new FormData(formElement);
    const response = await fetch(`/api/discussions/${encodeURIComponent(threadId)}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: form.get("body") }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setMessage(result.error || "The reply could not be posted.");
      setSubmitting(false);
      return;
    }
    formElement.reset();
    window.location.reload();
  }

  return (
    <form className="reply-composer" onSubmit={submit}>
      <label>
        Add to the conversation
        <textarea name="body" required maxLength={5000} placeholder="Write a thoughtful response…" />
      </label>
      <div>
        <button className="button button--scarlet" disabled={submitting} type="submit">{submitting ? "Posting…" : "Post reply"}</button>
        {message && <p role="alert">{message}</p>}
      </div>
    </form>
  );
}
