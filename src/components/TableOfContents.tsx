import type { TocItem } from "@/lib/content";

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ol className="space-y-1.5 text-sm">
      {items.map((t) => (
        <li key={t.id} className={t.depth === 3 ? "pl-4" : ""}>
          <a href={`#${t.id}`} className="block py-0.5 text-ink-700 no-underline hover:text-saffron-700">
            {t.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Collapsible on mobile, sticky sidebar on desktop (layout decides placement). */
export function TableOfContents({ items, variant }: { items: TocItem[]; variant: "mobile" | "desktop" }) {
  if (items.length < 3) return null;
  const top = items.filter((i) => i.depth === 2).length >= 3 ? items.filter((i) => i.depth === 2) : items;
  if (variant === "mobile") {
    return (
      <details className="card mb-8 lg:hidden">
        <summary className="flex min-h-[48px] cursor-pointer items-center px-4 font-semibold text-ink-900">On this page</summary>
        <nav aria-label="On this page" className="px-4 pb-4">
          <TocList items={top} />
        </nav>
      </details>
    );
  }
  return (
    <nav aria-label="Table of contents" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <p className="eyebrow mb-3">On this page</p>
      <TocList items={items} />
    </nav>
  );
}
