import { getAllEntries, shortTitle } from "./content";

/**
 * Pages implemented directly as React routes (not Markdown). Keeping them in
 * one registry lets the sitemap, breadcrumbs, search index and validator see
 * every URL on the site.
 */
export interface StaticRoute {
  url: string;
  title: string;
  shortTitle: string;
  description: string;
  noindex?: boolean;
  updated: string;
}

export const staticRoutes: StaticRoute[] = [
  {
    url: "/",
    title: "Shani Shingnapur Temple – Timings, Darshan, History & Travel Guide",
    shortTitle: "Home",
    description:
      "Independent guide to Shani Shingnapur Temple, Maharashtra: darshan, worship, history, festivals, how to reach from Shirdi, Pune and Mumbai, and nearby places.",
    updated: "2026-09-28",
  },
  {
    url: "/blog/",
    title: "Shani Shingnapur Blog – Pilgrimage, Travel & Shani Dev Articles",
    shortTitle: "Blog",
    description:
      "Articles on Shani Shingnapur: the doorless village, the best time to visit, Shani temples in Maharashtra, Sade Sati explained, and advice for families.",
    updated: "2026-09-28",
  },
  {
    url: "/plan-your-visit/",
    title: "Plan Your Shani Shingnapur Visit – Interactive Trip Planner",
    shortTitle: "Plan your visit",
    description:
      "Build a simple Shani Shingnapur itinerary: choose where you start, how long you have, how you travel and which nearby places you want to include.",
    updated: "2026-09-28",
  },
  {
    url: "/search/",
    title: "Search Shani Shingnapur Guides",
    shortTitle: "Search",
    description: "Search all temple, travel, festival and blog pages on ShaniShingnapurTemple.com.",
    noindex: true,
    updated: "2026-09-28",
  },
];

export const blogCategories = [
  { slug: "temple", name: "Temple", description: "History, traditions and visiting the shrine." },
  { slug: "travel", name: "Travel", description: "Getting there, timing your trip and practical logistics." },
  { slug: "pilgrimage", name: "Pilgrimage", description: "Combining Shani Shingnapur with other sacred sites." },
  { slug: "festivals", name: "Festivals", description: "Shani Jayanti, Shani Amavasya and the ritual year." },
  { slug: "shani-dev", name: "Shani Dev", description: "Understanding Shani Dev in Hindu tradition." },
  { slug: "maharashtra", name: "Maharashtra", description: "Temples and places across Maharashtra." },
  { slug: "visitor-guide", name: "Visitor Guide", description: "Advice for first-time visitors, families and elders." },
] as const;

export function titleForUrl(url: string): string | undefined {
  const s = staticRoutes.find((r) => r.url === url);
  if (s) return s.shortTitle;
  const e = getAllEntries().find((x) => x.url === url);
  if (e) return shortTitle(e);
  const cat = url.match(/^\/blog\/category\/([^/]+)\/$/);
  if (cat) return blogCategories.find((c) => c.slug === cat[1])?.name;
  return undefined;
}

/** Breadcrumb trail for a URL, from Home to the page itself. */
export function breadcrumbsFor(url: string, currentLabel?: string) {
  const parts = url.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", url: "/" }];
  let acc = "/";
  parts.forEach((p, i) => {
    acc += `${p}/`;
    const isLast = i === parts.length - 1;
    const name = isLast && currentLabel ? currentLabel : titleForUrl(acc);
    if (name) crumbs.push({ name, url: acc });
  });
  return crumbs;
}
