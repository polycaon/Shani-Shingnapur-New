import Link from "next/link";
import type { ContentEntry } from "@/lib/content";
import { breadcrumbsFor } from "@/lib/routes";
import { articleSchema, breadcrumbSchema, faqSchema, templeSchema } from "@/lib/seo";
import { faqData, faqGroups, type FaqKey } from "@/data/faqs";
import { absoluteUrl } from "@/data/site";
import { Breadcrumbs } from "./Breadcrumbs";
import { ArticleMeta } from "./ArticleMeta";
import { DisclaimerBox } from "./DisclaimerBox";
import { TableOfContents } from "./TableOfContents";
import { ContentRenderer, cardFor } from "./ContentRenderer";
import { FAQSection } from "./FAQSection";
import { SourceList } from "./SourceList";
import { RelatedArticles } from "./RelatedArticles";
import { ShareButtons } from "./ShareButtons";
import { JsonLd } from "./JsonLd";
import { AdSlot } from "./AdSlot";

export function resolveFaqs(f: ContentEntry["meta"]["faqs"]) {
  if (!f) return [];
  const keys: FaqKey[] = typeof f === "string" ? (faqGroups[f] ?? []) : f;
  if (typeof f === "string" && !faqGroups[f]) throw new Error(`Unknown FAQ group "${f}"`);
  return keys.map((k) => {
    if (!faqData[k]) throw new Error(`Unknown FAQ key "${k}"`);
    return faqData[k];
  });
}

export function ContentPage({ entry }: { entry: ContentEntry }) {
  const { meta, url } = entry;
  const crumbs = breadcrumbsFor(url, meta.shortTitle ?? meta.title);
  const faqs = resolveFaqs(meta.faqs);
  const related = (meta.related ?? []).map(cardFor);
  const isBlog = entry.collection === "blog";
  const isLegal = meta.kind === "legal";
  const showToc = meta.toc ?? (entry.toc.filter((t) => t.depth === 2).length >= 4 && !isLegal);
  const schema: object[] = [breadcrumbSchema(crumbs)];
  if (!isLegal && meta.kind !== "tool") {
    schema.push(
      articleSchema({
        url,
        title: meta.title,
        description: meta.description,
        published: meta.published,
        updated: meta.updated,
        blog: isBlog,
        about: url.startsWith("/temple/") || url.startsWith("/travel/") || url.startsWith("/festivals/"),
      }),
    );
  }
  if (meta.schema?.length) schema.push(templeSchema(meta.schema));
  if (faqs.length) schema.push(faqSchema(faqs));

  return (
    <>
      <JsonLd data={schema} />
      <div className="border-b border-sand-200 bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={crumbs} />
          {isBlog && meta.category && <p className="eyebrow mt-5">{meta.category.replace(/-/g, " ")}</p>}
          <h1 className={`${isBlog && meta.category ? "mt-2" : "mt-5"} max-w-4xl text-balance text-3xl text-ink-900 sm:text-4xl lg:text-[2.75rem]`}>
            {meta.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-700">{meta.description}</p>
          {!isLegal && (
            <div className="mt-4">
              <ArticleMeta updated={meta.updated} published={meta.published} readingMinutes={Math.max(1, Math.round(entry.wordCount / 220))} />
            </div>
          )}
        </div>
      </div>

      <div className="container-page py-8 sm:py-10">
        <div className={showToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12" : ""}>
          <article className="min-w-0">
            {showToc && <TableOfContents items={entry.toc} variant="mobile" />}
            {meta.quickAnswer && (
              <div className="mb-8 max-w-[44rem] rounded-2xl border-l-4 border-saffron-600 bg-white p-5 shadow-sm">
                <p className="eyebrow">Quick answer</p>
                <p className="mt-1.5 text-[1.05rem] leading-relaxed text-ink-900">{meta.quickAnswer}</p>
              </div>
            )}
            {meta.disclaimer && (
              <div className="mb-8 max-w-[44rem]">
                <DisclaimerBox kind={meta.disclaimer} />
              </div>
            )}
            <ContentRenderer segments={entry.segments} pageUrl={url} />
            <AdSlot slot="below-content" />
            {faqs.length > 0 && (
              <div className="max-w-[44rem]">
                <FAQSection faqs={faqs} />
              </div>
            )}
            {meta.sources?.length ? (
              <div className="max-w-[44rem]">
                <SourceList keys={meta.sources} />
              </div>
            ) : null}
            {!isLegal && (
              <div className="mt-10 max-w-[44rem] border-t border-sand-200 pt-6">
                <ShareButtons url={absoluteUrl(url)} title={meta.title} />
                <p className="mt-4 text-sm text-ink-600">
                  Spotted something out of date or incorrect? <Link href="/contact/">Tell us</Link> — see our{" "}
                  <Link href="/editorial-policy/">editorial policy</Link> for how corrections are handled.
                </p>
              </div>
            )}
          </article>
          {showToc && (
            <aside>
              <TableOfContents items={entry.toc} variant="desktop" />
            </aside>
          )}
        </div>
        <RelatedArticles items={related} />
      </div>
    </>
  );
}
