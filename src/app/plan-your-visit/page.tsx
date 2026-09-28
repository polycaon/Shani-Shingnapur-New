import Link from "next/link";
import { staticRoutes, breadcrumbsFor } from "@/lib/routes";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TripPlanner } from "@/components/TripPlanner";
import { JsonLd } from "@/components/JsonLd";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { RelatedArticles } from "@/components/RelatedArticles";
import { cardFor } from "@/components/ContentRenderer";

const route = staticRoutes.find((r) => r.url === "/plan-your-visit/")!;
export const metadata = buildMetadata({ url: route.url, title: route.title, description: route.description });

export default function PlanPage() {
  const crumbs = breadcrumbsFor(route.url);
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className="border-b border-sand-200 bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="container-page py-8 sm:py-10">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 text-3xl sm:text-4xl">Plan Your Shani Shingnapur Visit</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-700">
            Tell us where you are starting, how much time you have and what else you would like to see. We will sketch a
            realistic outline using the travel information on this site — then use our detailed guides to fine-tune it.
          </p>
        </div>
      </div>
      <div className="container-page py-10">
        <div className="mb-8 max-w-3xl">
          <DisclaimerBox kind="both" />
        </div>
        <TripPlanner />
        <section className="prose-content mt-14">
          <h2>Before you finalise your plan</h2>
          <ul>
            <li>
              Check the <Link href="/festivals/festival-calendar/">festival calendar</Link> — Saturdays, Shani Amavasya and
              Shani Jayanti bring very large crowds.
            </li>
            <li>
              Read the <Link href="/temple/darshan/">darshan guide</Link> so you know what to carry and what to expect at
              the shrine.
            </li>
            <li>
              Compare places to stay in <Link href="/travel/accommodation/">our accommodation guide</Link>.
            </li>
          </ul>
        </section>
        <RelatedArticles
          items={["/pilgrimage/shirdi-shani-shingnapur-one-day-trip/", "/pilgrimage/shirdi-shani-shingnapur-two-day-itinerary/", "/travel/how-to-reach/", "/distance/"].map(cardFor)}
        />
      </div>
    </>
  );
}
