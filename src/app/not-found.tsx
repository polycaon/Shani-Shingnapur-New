import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Shani Shingnapur Temple" },
  robots: { index: false, follow: true },
};

const links = [
  ["Temple guide", "/temple/"],
  ["Temple timings", "/temple/timings/"],
  ["Travel guide", "/travel/"],
  ["Darshan guide", "/temple/darshan/"],
  ["Nearby places", "/nearby-places/"],
  ["Blog", "/blog/"],
];

export default function NotFound() {
  return (
    <div className="container-page max-w-3xl py-16">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Looking for Shani Shingnapur information?</h1>
      <p className="mt-4 text-lg text-ink-700">
        We couldn&apos;t find that page. It may have moved, or the link may be mistyped. Try a search or one of our most
        useful guides.
      </p>
      <form action="/search/" role="search" className="mt-6 flex gap-2">
        <label htmlFor="nf-search" className="sr-only">
          Search
        </label>
        <input id="nf-search" name="q" type="search" placeholder="Search the guide" className="min-h-[48px] w-full rounded-xl border border-sand-300 bg-white px-4 text-base" />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {links.map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="card card-link flex min-h-[56px] items-center justify-between px-5 font-semibold">
              {l} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
