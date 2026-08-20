"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_DURATION = 3600;
const INTRO_SESSION_KEY = "pgo-mystery-school-entry-seen";

export function MemberPortalIntro() {
  const [visible, setVisible] = useState(true);
  const skipButton = useRef<HTMLButtonElement>(null);

  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // The transition should still complete if storage is unavailable.
    }
    document.documentElement.classList.remove("member-intro-locked");
    document.body.classList.remove("member-intro-locked");
    setVisible(false);
  }, []);

  useEffect(() => {
    const forceReplay = new URLSearchParams(window.location.search).get("intro") === "1";
    let alreadySeen = false;

    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
    } catch {
      // Treat blocked session storage as a fresh entry.
    }

    if (alreadySeen && !forceReplay) {
      const hideImmediately = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(hideImmediately);
    }

    document.documentElement.classList.add("member-intro-locked");
    document.body.classList.add("member-intro-locked");
    skipButton.current?.focus({ preventScroll: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(finishIntro, reducedMotion ? 450 : INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove("member-intro-locked");
      document.body.classList.remove("member-intro-locked");
    };
  }, [finishIntro]);

  if (!visible) return null;

  return (
    <div className="member-gate" aria-label="Opening the protected Mystery School member chamber">
      <div className="member-gate__field" aria-hidden="true">
        <span className="member-gate__ring member-gate__ring--outer" />
        <span className="member-gate__ring member-gate__ring--middle" />
        <span className="member-gate__ring member-gate__ring--inner" />
        <span className="member-gate__ring member-gate__ring--core" />

        <div className="member-gate__lines member-gate__lines--one">
          <span /><span /><span /><span />
        </div>
        <div className="member-gate__lines member-gate__lines--two">
          <span /><span /><span /><span />
        </div>

        <div className="member-gate__seal">
          <img src="/assets/brand/mystery-school-of-pi.png" alt="" width={922} height={922} />
        </div>
      </div>

      <div className="member-gate__copy">
        <span>Authenticated passage</span>
        <strong>Mystery School of Pi</strong>
        <small>Fraternal access · ΠΓΟ</small>
      </div>

      <p className="member-gate__status" role="status" aria-live="polite">
        Opening the members’ chamber
      </p>
      <button ref={skipButton} className="member-gate__skip" type="button" onClick={finishIntro}>
        Skip transition
      </button>
    </div>
  );
}
