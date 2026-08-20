import { useEffect, useState } from "react";
import ChaptersPage from "../app/chapters/page";
import HistoryPage from "../app/history/page";
import JoinPage from "../app/join/page";
import HomePage from "../app/page";
import PrivacyPage from "../app/privacy/page";
import { siteHref } from "../lib/site-urls";
import { MemberPreview } from "./MemberPreview";

type DemoLocation = {
  path: string;
  anchor: string;
};

const titles: Record<string, string> = {
  "/": "Founded 1905",
  "/history": "History & Archive",
  "/chapters": "Chapters & Expansion",
  "/join": "Express Interest",
  "/privacy": "Privacy Notice",
  "/members": "Members' Portal Preview",
};

function readLocation(): DemoLocation {
  const raw = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const [pathPart, anchor = ""] = (raw || "/").split("#", 2);
  return {
    path: pathPart.startsWith("/") ? pathPart : "/",
    anchor,
  };
}

export function DemoApp() {
  const [location, setLocation] = useState<DemoLocation>(() => readLocation());

  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    const titleKey = location.path.startsWith("/members") ? "/members" : location.path;
    document.title = `${titles[titleKey] ?? "Interactive Preview"} | Pi Gamma Omicron`;
    window.requestAnimationFrame(() => {
      if (location.anchor) {
        document.getElementById(location.anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    });
  }, [location]);

  let page;
  if (location.path.startsWith("/members")) {
    page = <MemberPreview key={location.path} route={location.path} />;
  } else {
    switch (location.path) {
      case "/history":
        page = <HistoryPage />;
        break;
      case "/chapters":
        page = <ChaptersPage />;
        break;
      case "/join":
        page = <JoinPage />;
        break;
      case "/privacy":
        page = <PrivacyPage />;
        break;
      default:
        page = <HomePage />;
    }
  }

  return (
    <>
      <aside className="demo-ribbon" aria-label="Static preview status">
        <span>Interactive preview</span>
        <strong>No private data · Actions are simulated</strong>
        <a href={siteHref(location.path.startsWith("/members") ? "/" : "/members")}>
          {location.path.startsWith("/members") ? "View public site" : "Preview members' portal"}
        </a>
      </aside>
      {page}
    </>
  );
}
