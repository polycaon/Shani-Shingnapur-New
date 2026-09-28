import { sources, type SourceKey } from "@/data/sources";

export function SourceList({ keys }: { keys: SourceKey[] }) {
  if (!keys.length) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-12 border-t border-sand-200 pt-8">
      <h2 id="sources-heading" className="text-xl">
        Sources &amp; references
      </h2>
      <p className="mt-2 text-sm text-ink-600">
        We use these sources for research and verification. Where they disagree, we say so on the page. Linking to a source
        does not imply that it endorses this website.
      </p>
      <ol className="mt-4 space-y-2 text-sm">
        {keys.map((k) => {
          const s = sources[k];
          return (
            <li key={k} className="flex gap-2">
              <span aria-hidden="true" className="text-gold-500">
                ›
              </span>
              <span>
                <a href={s.url} target="_blank" rel="noopener" className="font-medium underline-offset-2 hover:underline">
                  {s.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                <span className="text-ink-600">— {s.publisher}</span>
                {"note" in s && s.note ? <span className="block text-ink-600">{s.note}</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
