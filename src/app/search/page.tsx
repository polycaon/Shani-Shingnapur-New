import { Suspense } from "react";
import { staticRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { SearchClient } from "@/components/SearchClient";

const route = staticRoutes.find((r) => r.url === "/search/")!;
export const metadata = buildMetadata({ url: route.url, title: route.title, description: route.description, noindex: true });

export default function SearchPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="text-3xl sm:text-4xl">Search the guide</h1>
      <p className="mt-3 text-ink-700">Search temple, travel, festival and blog pages, plus frequently asked questions.</p>
      <div className="mt-6">
        <Suspense fallback={<p>Loading search…</p>}>
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}
