import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-600">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink-800">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.url} className="text-ink-600 underline-offset-2 hover:text-saffron-700 hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden="true" className="text-sand-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
