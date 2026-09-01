/* eslint-disable @next/next/no-html-link-for-pages -- Vinext Link navigation currently throws at runtime. */
import { breadcrumbJsonLd } from "../../lib/seo";

type JsonLdValue = Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;

export function JsonLd({ data }: { data: JsonLdValue }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function Breadcrumbs({
  current,
  path,
  tone = "light",
}: {
  current: string;
  path: string;
  tone?: "light" | "dark";
}) {
  const items = [
    { name: "Home", path: "/" },
    { name: current, path },
  ] as const;

  return (
    <>
      <nav className={`breadcrumbs breadcrumbs--${tone}`} aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">{current}</li>
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}
