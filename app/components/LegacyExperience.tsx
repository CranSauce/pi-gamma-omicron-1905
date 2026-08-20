"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { SiteHeader } from "./SiteChrome";

const sceneBreaks = [0.11, 0.28, 0.47, 0.66, 0.84];

export function LegacyExperience() {
  const experienceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = experience.getBoundingClientRect();
      const distance = Math.max(experience.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const scene = sceneBreaks.findIndex((point) => progress < point);

      experience.style.setProperty("--legacy-progress", progress.toFixed(4));
      experience.dataset.scene = String(scene === -1 ? sceneBreaks.length : scene);
    };

    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    experience.dataset.enhanced = "true";
    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, []);

  return (
    <section
      ref={experienceRef}
      className="legacy-experience"
      data-scene="0"
      aria-labelledby="legacy-experience-title"
    >
      <div className="legacy-experience__stage">
        <div className="legacy-experience__grain" aria-hidden="true" />
        <div className="legacy-experience__light" aria-hidden="true" />
        <SiteHeader />

        <div className="legacy-experience__rail" aria-hidden="true">
          <span>1905</span>
          <i><b /></i>
          <span>2026</span>
        </div>

        <div className="legacy-artifact" aria-hidden="true">
          <div className="legacy-artifact__orbit legacy-artifact__orbit--outer" />
          <div className="legacy-artifact__orbit legacy-artifact__orbit--inner" />
          <div className="legacy-artifact__glow" />
          <img
            className="legacy-artifact__layer legacy-artifact__layer--silver"
            src="/assets/brand/pi-gamma-omicron-crest.png"
            width={1024}
            height={1024}
            alt=""
          />
          <img
            className="legacy-artifact__layer legacy-artifact__layer--scarlet"
            src="/assets/brand/pi-gamma-omicron-crest.png"
            width={1024}
            height={1024}
            alt=""
          />
          <img
            className="legacy-artifact__layer legacy-artifact__layer--main"
            src="/assets/brand/pi-gamma-omicron-crest.png"
            width={1024}
            height={1024}
            alt=""
          />
        </div>

        <div className="legacy-documents" aria-hidden="true">
          <figure className="legacy-document legacy-document--left">
            <img src="/assets/archive/press-january-3.png" width={1224} height={627} alt="" />
            <figcaption>January 3 · Contemporary press</figcaption>
          </figure>
          <figure className="legacy-document legacy-document--right">
            <img src="/assets/archive/press-january-4-1906.png" width={1224} height={1211} alt="" />
            <figcaption>January 4, 1906 · Public record</figcaption>
          </figure>
        </div>

        <div className="legacy-scenes">
          <div className="legacy-scene legacy-scene--silence" data-legacy-scene="0">
            <p className="legacy-scene__eyebrow">Pi Gamma Omicron</p>
            <h1 id="legacy-experience-title">
              <span>Darkness shall</span>
              <span>give way to light.</span>
            </h1>
            <p className="legacy-scene__motto"><em>Tenebrae Luci Locum Dabunt</em></p>
          </div>

          <div className="legacy-scene legacy-scene--founding" data-legacy-scene="1">
            <p className="legacy-scene__eyebrow">Columbus, Ohio · Sunday, January 1</p>
            <p className="legacy-scene__year">1905</p>
            <h2>Born at Ohio State.</h2>
            <p>Eleven Black students built an institution of their own.</p>
          </div>

          <div className="legacy-scene legacy-scene--record" data-legacy-scene="2">
            <p className="legacy-scene__eyebrow">The surviving record · 1906</p>
            <h2>Built through<br />brotherhood.</h2>
            <p>Scholarship, moral courage, and a vision that reached beyond Columbus.</p>
          </div>

          <div className="legacy-scene legacy-scene--quiet" data-legacy-scene="3">
            <p className="legacy-scene__eyebrow">The archival gap</p>
            <h2>For generations,<br />the record grew quiet.</h2>
            <p>We preserve what is known. We do not invent what history has not yet returned.</p>
          </div>

          <div className="legacy-scene legacy-scene--renewal" data-legacy-scene="4">
            <p className="legacy-scene__eyebrow">A brotherhood renewed · 2023</p>
            <h2>The legacy<br />continues.</h2>
            <p>A legacy remembered. A new institutional chapter begins.</p>
          </div>

          <div className="legacy-scene legacy-scene--future" data-legacy-scene="5">
            <p className="legacy-scene__eyebrow">1905 · 2026 · Beyond</p>
            <p className="legacy-scene__year">2026</p>
            <h2>The past hands<br />the future the torch.</h2>
            <a className="legacy-scene__enter" href="#legacy-begins">Enter the next chapter <span>↓</span></a>
          </div>
        </div>

        <div className="legacy-experience__progress" aria-hidden="true"><span /></div>
        <p className="legacy-experience__scroll" aria-hidden="true">Scroll to enter the legacy</p>
      </div>
    </section>
  );
}
