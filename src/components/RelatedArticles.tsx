import { CardGrid, type CardItem } from "./CardGrid";

export function RelatedArticles({ items, heading = "Related guides" }: { items: CardItem[]; heading?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="related-heading" className="no-print mt-14">
      <h2 id="related-heading" className="text-2xl sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-5">
        <CardGrid items={items} />
      </div>
    </section>
  );
}
