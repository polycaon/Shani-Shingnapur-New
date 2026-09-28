import type { MetadataRoute } from "next";
import { getAllEntries, getPosts } from "@/lib/content";
import { staticRoutes, blogCategories } from "@/lib/routes";
import { absoluteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = getAllEntries()
    .filter((e) => !e.meta.noindex)
    .map((e) => ({
      url: absoluteUrl(e.url),
      lastModified: e.meta.updated,
      changeFrequency: (e.url.includes("timings") || e.url.includes("festival") ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: e.slug.length <= 1 ? 0.8 : 0.6,
    }));
  const statics = staticRoutes
    .filter((r) => !r.noindex)
    .map((r) => ({ url: absoluteUrl(r.url), lastModified: r.updated, priority: r.url === "/" ? 1 : 0.7 }));
  const posts = getPosts();
  const cats = blogCategories
    .filter((c) => posts.filter((p) => p.meta.category === c.slug).length >= 2)
    .map((c) => ({ url: absoluteUrl(`/blog/category/${c.slug}/`), priority: 0.4 }));
  return [...statics, ...entries, ...cats];
}
