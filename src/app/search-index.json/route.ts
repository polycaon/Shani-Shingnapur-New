import { getAllEntries } from "@/lib/content";
import { staticRoutes } from "@/lib/routes";
import { faqData } from "@/data/faqs";
import type { SearchDoc } from "@/components/SearchClient";

export const dynamic = "force-static";

const SECTION: [string, string][] = [
  ["/blog/", "Blog"],
  ["/temple/", "Temple"],
  ["/shani-dev/", "Shani Dev"],
  ["/travel/", "Travel"],
  ["/distance/", "Distances"],
  ["/pilgrimage/", "Pilgrimage"],
  ["/nearby-places/", "Nearby places"],
  ["/festivals/", "Festivals"],
];

export function GET() {
  const section = (url: string) => SECTION.find(([p]) => url.startsWith(p))?.[1] ?? "Guide";
  const docs: SearchDoc[] = [
    ...staticRoutes
      .filter((r) => !r.noindex)
      .map((r) => ({ url: r.url, title: r.shortTitle === "Home" ? r.title : r.shortTitle, description: r.description, section: "Guide", text: "", kind: "page" as const })),
    ...getAllEntries()
      .filter((e) => !e.meta.noindex)
      .map((e) => ({
        url: e.url,
        title: e.meta.title,
        description: e.meta.description,
        section: section(e.url),
        // Headings + opening text keep the index small but useful.
        text: `${e.toc.map((t) => t.text).join(" ")} ${e.plainText.slice(0, 1500)}`,
        kind: e.collection === "blog" ? ("blog" as const) : ("page" as const),
      })),
    ...Object.values(faqData).map((f) => ({
      url: "/faq/",
      title: f.q,
      description: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 200),
      section: "FAQ",
      text: f.a,
      kind: "faq" as const,
    })),
  ];
  return Response.json(docs);
}
