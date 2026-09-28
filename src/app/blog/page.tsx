import Link from "next/link";
import { getPosts } from "@/lib/content";
import { blogCategories, breadcrumbsFor, staticRoutes } from "@/lib/routes";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/data/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/components/ArticleMeta";
import { cardFor } from "@/components/ContentRenderer";

const route = staticRoutes.find((r) => r.url === "/blog/")!;
export const metadata = buildMetadata({ url: route.url, title: route.title, description: route.description });

/** Pillar guides that answer the most common blog-style questions — linked, not duplicated. */
const ESSENTIALS = [
  "/temple/",
  "/temple/timings/",
  "/travel/how-to-reach/",
  "/travel/from-shirdi/",
  "/temple/history/",
  "/festivals/shani-jayanti/",
  "/festivals/saturday/",
  "/pilgrimage/shirdi-shani-shingnapur-one-day-trip/",
  "/pilgrimage/maharashtra-temple-tour/",
  "/nearby-places/",
  "/shani-dev/mantra/",
  "/travel/travel-tips/",
];

export default function BlogIndex() {
  const posts = getPosts();
  const cats = blogCategories.filter((c) => posts.some((p) => p.meta.category === c.slug));
  const crumbs = breadcrumbsFor("/blog/");
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Shani Shingnapur Blog",
            url: absoluteUrl("/blog/"),
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.meta.title, url: absoluteUrl(p.url), dateModified: p.meta.updated })),
          },
        ]}
      />
      <div className="border-b border-sand-200 bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 text-3xl sm:text-4xl">Shani Shingnapur Blog</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-700">
            In-depth articles on the temple&apos;s traditions, planning your visit and understanding Shani Dev. For quick
            practical answers, start with the essential guides further down.
          </p>
          <nav aria-label="Blog categories" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link href={`/blog/category/${c.slug}/`} className="btn btn-outline min-h-[40px] py-1.5 text-sm">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="container-page py-10">
        <h2 className="text-2xl sm:text-3xl">Latest articles</h2>
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.url}>
              <Link href={p.url} className="card card-link h-full p-6">
                <span className="eyebrow">{blogCategories.find((c) => c.slug === p.meta.category)?.name}</span>
                <span className="mt-2 block font-display text-xl leading-snug text-ink-900">{p.meta.title}</span>
                <span className="mt-2 block text-ink-700">{p.meta.description}</span>
                <span className="mt-3 block text-sm text-ink-600">
                  Updated <time dateTime={p.meta.updated}>{formatDate(p.meta.updated)}</time> · {Math.max(1, Math.round(p.wordCount / 220))} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-16 text-2xl sm:text-3xl">Essential guides</h2>
        <p className="mt-2 max-w-3xl text-ink-700">
          These core guides are kept up to date as the main reference on each topic.
        </p>
        <div className="mt-6">
          <CardGrid items={ESSENTIALS.map(cardFor)} />
        </div>
      </div>
    </>
  );
}
