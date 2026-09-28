import Link from "next/link";

export interface CardItem {
  href: string;
  title: string;
  text?: string;
  eyebrow?: string;
}

export function CardGrid({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`not-prose grid gap-4 ${cols}`} role="list">
      {items.map((c) => (
        <li key={c.href}>
          <Link href={c.href} className="card card-link h-full p-5">
            {c.eyebrow && <span className="eyebrow">{c.eyebrow}</span>}
            <span className="mt-1 block text-lg font-semibold leading-snug text-ink-900">{c.title}</span>
            {c.text && <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-700">{c.text}</span>}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-saffron-700">
              Read guide <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
