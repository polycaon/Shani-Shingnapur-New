import Link from "next/link";
import { siteConfig } from "@/data/site";
import { formatIsoDate } from "@/lib/dates";

const fmt = (iso: string) => formatIsoDate(iso);

/** Combined LastUpdated + AuthorInfo line. */
export function ArticleMeta({ updated, published, readingMinutes }: { updated: string; published?: string; readingMinutes?: number }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-600">
      <span>
        By{" "}
        <Link href="/about/" className="font-medium text-ink-800 underline-offset-2 hover:underline">
          {siteConfig.editorialTeam}
        </Link>
      </span>
      {published && published !== updated && (
        <span>
          Published <time dateTime={published}>{fmt(published)}</time>
        </span>
      )}
      <span>
        Last updated <time dateTime={updated}>{fmt(updated)}</time>
      </span>
      {readingMinutes ? <span>{readingMinutes} min read</span> : null}
    </p>
  );
}

export { fmt as formatDate };
