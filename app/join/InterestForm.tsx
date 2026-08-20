"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function InterestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current ?? 0 }),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "We could not submit your interest right now.");

      setState("success");
      setMessage(result.message ?? "Your interest has been received.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We could not submit your interest right now.");
    }
  }

  if (state === "success") {
    return (
      <div className="interest-success" role="status">
        <span>ΠΓΟ</span>
        <p className="section-label">Interest received</p>
        <h2>Thank you for stepping forward.</h2>
        <p>{message} A fraternity officer will review your submission and contact you using the information provided.</p>
        <button className="button button--scarlet" type="button" onClick={() => { setState("idle"); setMessage(""); startedAt.current = Date.now(); }}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form className="interest-form" onSubmit={submitInterest}>
      <div className="interest-form__section">
        <div className="interest-form__heading"><span>01</span><h2>Tell us who you are.</h2></div>
        <div className="interest-form__fields interest-form__fields--two">
          <label>Full name<input name="fullName" autoComplete="name" required /></label>
          <label>Preferred name<input name="preferredName" autoComplete="nickname" /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label>
          <label>City<input name="city" autoComplete="address-level2" required /></label>
          <label>State<input name="state" autoComplete="address-level1" required maxLength={32} /></label>
        </div>
      </div>

      <div className="interest-form__section">
        <div className="interest-form__heading"><span>02</span><h2>Tell us where you are building.</h2></div>
        <div className="interest-form__fields interest-form__fields--two">
          <label>Institution or school<input name="institution" required /></label>
          <label>Institution type
            <select name="institutionType" required defaultValue="">
              <option value="" disabled>Select one</option>
              <option>University</option><option>College</option><option>Community college</option><option>Trade school</option><option>Graduate or professional school</option><option>Other</option>
            </select>
          </label>
          <label>Major or field<input name="fieldOfStudy" /></label>
          <label>Graduation year<input name="graduationYear" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} /></label>
          <label>Current status
            <select name="currentStatus" required defaultValue="">
              <option value="" disabled>Select one</option>
              <option>Current student</option><option>Graduate</option><option>Working professional</option><option>Other</option>
            </select>
          </label>
          <label>Chapter interest
            <select name="chapterInterest" required defaultValue="">
              <option value="" disabled>Select one</option>
              <option>Alpha Chapter — Columbus, Ohio</option><option>Beta Chapter — Kennesaw, Georgia</option><option>New chapter or expansion</option><option>Not sure yet</option>
            </select>
          </label>
        </div>
      </div>

      <div className="interest-form__section">
        <div className="interest-form__heading"><span>03</span><h2>Tell us what draws you forward.</h2></div>
        <div className="interest-form__fields">
          <label>Why are you interested in Pi Gamma Omicron?<textarea name="whyInterested" required rows={5} /></label>
          <label>What does brotherhood mean to you?<textarea name="brotherhoodMeaning" required rows={5} /></label>
          <label>How did you hear about the fraternity?<input name="referralSource" /></label>
        </div>
      </div>

      <label className="interest-form__honeypot" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>

      <div className="interest-form__consent">
        <label>
          <input type="checkbox" name="consent" value="yes" required />
          <span>I consent to Pi Gamma Omicron storing this information and contacting me about membership or chapter interest. I have reviewed the <a href="/privacy" target="_blank">privacy notice</a>.</span>
        </label>
        <button className="button button--scarlet" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Submitting…" : "Submit your interest"}
        </button>
        {message && <p className={`interest-form__message interest-form__message--${state}`} role="alert">{message}</p>}
      </div>
    </form>
  );
}
