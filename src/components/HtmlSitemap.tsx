import Link from "next/link";
import { getAllEntries, shortTitle } from "@/lib/content";
import { staticRoutes } from "@/lib/routes";

const SECTIONS: [string, string][] = [
  ["/temple/", "Temple"],
  ["/shani-dev/", "Shani Dev"],
  ["/travel/", "Travel"],
  ["/distance/", "Distances"],
  ["/pilgrimage/", "Pilgrimage"],
  ["/nearby-places/", "Nearby places"],
  ["/festivals/", "Festivals"],
  ["/blog/", "Blog"],
];

export function HtmlSitemap() {
  const entries = getAllEntries().filter((e) => !e.meta.noindex);
  const inSection = new Set<string>();
  const groups = SECTIONS.map(([prefix, label]) => {
    const items = entries.filter((e) => e.url.startsWith(prefix)).sort((a, b) => a.url.localeCompare(b.url));
    items.forEach((i) => inSection.add(i.url));
    return { label, items: items.map((i) => ({ url: i.url, title: shortTitle(i) })) };
  });
  const other = [
    ...staticRoutes.filter((r) => !r.noindex && !inSection.has(r.url)).map((r) => ({ url: r.url, title: r.shortTitle })),
    ...entries.filter((e) => !inSection.has(e.url)).map((e) => ({ url: e.url, title: shortTitle(e) })),
  ];
  groups.push({ label: "Site & resources", items: other });
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <section key={g.label}>
          <h2 className="text-xl">{g.label}</h2>
          <ul className="mt-2 space-y-1 text-[0.95rem]">
            {g.items.map((i) => (
              <li key={i.url}>
                <Link href={i.url}>{i.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
