import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/content";
import { blogCategories, breadcrumbsFor } from "@/lib/routes";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getPosts();
  return blogCategories.filter((c) => posts.some((p) => p.meta.category === c.slug)).map((c) => ({ category: c.slug }));
}

type Props = { params: Promise<{ category: string }> };

function load(slug: string) {
  const cat = blogCategories.find((c) => c.slug === slug);
  const posts = getPosts().filter((p) => p.meta.category === slug);
  return { cat, posts };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const { cat, posts } = load(category);
  if (!cat) return {};
  return buildMetadata({
    url: `/blog/category/${cat.slug}/`,
    title: `${cat.name} Articles – Shani Shingnapur Blog`,
    description: `${cat.description} Articles in the ${cat.name} category of the Shani Shingnapur blog.`,
    // Thin archive pages stay out of the index until they have real depth.
    noindex: posts.length < 2,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const { cat, posts } = load(category);
  if (!cat) notFound();
  const crumbs = breadcrumbsFor(`/blog/category/${cat.slug}/`);
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="container-page py-10">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-5 text-3xl sm:text-4xl">{cat.name} articles</h1>
        <p className="mt-3 max-w-3xl text-lg text-ink-700">{cat.description}</p>
        <div className="mt-8">
          <CardGrid columns={2} items={posts.map((p) => ({ href: p.url, title: p.meta.title, text: p.meta.description }))} />
        </div>
      </div>
    </>
  );
}
