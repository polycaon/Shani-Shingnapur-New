import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPosts, getEntryByUrl } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug[1] }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = getEntryByUrl(`/blog/${slug}/`);
  if (!e) return {};
  return buildMetadata({
    url: e.url,
    title: e.meta.metaTitle ?? e.meta.title,
    description: e.meta.description,
    type: "article",
    noindex: e.meta.noindex,
    published: e.meta.published,
    updated: e.meta.updated,
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const e = getEntryByUrl(`/blog/${slug}/`);
  if (!e || e.collection !== "blog") notFound();
  return <ContentPage entry={e} />;
}
