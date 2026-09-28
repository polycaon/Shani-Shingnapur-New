import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPages, getEntryByUrl } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";

export const dynamicParams = false;
// Rebuild daily so "current year" widgets (e.g. the festival calendar) stay fresh.
export const revalidate = 86400;

export function generateStaticParams() {
  return getPages()
    .filter((p) => p.slug.length > 0)
    .map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryByUrl(`/${slug.join("/")}/`);
  if (!entry) return {};
  const m = entry.meta;
  return buildMetadata({
    url: entry.url,
    title: m.metaTitle ?? m.title,
    description: m.description,
    type: m.kind === "legal" || m.kind === "hub" ? "website" : "article",
    noindex: m.noindex,
    published: m.published,
    updated: m.updated,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryByUrl(`/${slug.join("/")}/`);
  if (!entry || entry.collection !== "pages") notFound();
  return <ContentPage entry={entry} />;
}
