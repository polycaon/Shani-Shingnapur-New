"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export interface SearchDoc {
  url: string;
  title: string;
  description: string;
  section: string;
  text: string;
  kind: "page" | "blog" | "faq";
}

function tokenize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function score(doc: SearchDoc, terms: string[], phrase: string) {
  const title = doc.title.toLowerCase();
  const desc = doc.description.toLowerCase();
  const text = doc.text.toLowerCase();
  let s = 0;
  for (const t of terms) {
    const inTitle = title.includes(t);
    const inDesc = desc.includes(t);
    const inText = text.includes(t);
    if (!inTitle && !inDesc && !inText) return 0; // every term must match somewhere
    s += (inTitle ? 10 : 0) + (inDesc ? 4 : 0) + (inText ? 1 : 0);
  }
  if (title.includes(phrase)) s += 15;
  if (doc.kind === "faq") s *= 0.9;
  return s;
}

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => setFailed(true));
  }, []);

  const results = useMemo(() => {
    if (!docs || !q.trim()) return [];
    const terms = tokenize(q);
    if (!terms.length) return [];
    const phrase = q.toLowerCase().trim();
    return docs
      .map((d) => ({ d, s: score(d, terms, phrase) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30)
      .map((r) => r.d);
  }, [docs, q]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search/?q=${encodeURIComponent(q)}`, { scroll: false });
        }}
        className="flex gap-2"
      >
        <label htmlFor="site-search" className="sr-only">
          Search this website
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “timings”, “from Pune” or “Shani Jayanti”"
          className="min-h-[48px] w-full rounded-xl border border-sand-300 bg-white px-4 text-base"
          autoFocus
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <div aria-live="polite" className="mt-6">
        {failed && <p>Search is unavailable right now. Please use the menu or the <Link href="/sitemap/">sitemap</Link>.</p>}
        {!failed && q.trim() && docs && (
          <p className="text-sm text-ink-600">
            {results.length ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q.trim()}”` : null}
          </p>
        )}
        {!failed && q.trim() && docs && results.length === 0 && (
          <div className="card mt-4 p-5">
            <p className="font-semibold">No pages matched “{q.trim()}”.</p>
            <p className="mt-2 text-ink-700">Try a shorter or more general word, or start from one of these guides:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[
                ["Temple timings", "/temple/timings/"],
                ["How to reach", "/travel/how-to-reach/"],
                ["From Shirdi", "/travel/from-shirdi/"],
                ["Festivals", "/festivals/"],
                ["Nearby places", "/nearby-places/"],
                ["FAQs", "/faq/"],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="btn btn-outline min-h-[40px] py-1.5 text-sm">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul className="mt-4 space-y-3">
          {results.map((r) => (
            <li key={r.url + r.title}>
              <Link href={r.url} className="card card-link p-4">
                <span className="eyebrow">{r.kind === "faq" ? "FAQ" : r.section}</span>
                <span className="mt-1 block font-semibold text-ink-900">{r.title}</span>
                <span className="mt-1 block text-sm text-ink-700">{r.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
