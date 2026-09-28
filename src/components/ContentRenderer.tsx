import type { Segment } from "@/lib/content";
import { getChildren, getEntryByUrl, getPosts, shortTitle } from "@/lib/content";
import { staticRoutes } from "@/lib/routes";
import { QuickInfoCard, TimingsTable, VisitorGuidanceTable, TrustLink } from "./TempleData";
import { DistanceTable, DistanceCard, RouteOptions, StationsTable, AirportsTable } from "./TravelData";
import { FestivalList } from "./FestivalList";
import { FestivalCalendar } from "./FestivalCalendar";
import { DistanceCalculator } from "./DistanceCalculator";
import { ContactForm } from "./ContactForm";
import { ImageGallery } from "./ImageGallery";
import { MapButton } from "./MapButton";
import { CardGrid } from "./CardGrid";
import { FAQSection } from "./FAQSection";
import { AdSlot } from "./AdSlot";
import { faqData, faqGroups, type FaqKey } from "@/data/faqs";
import { HtmlSitemap } from "./HtmlSitemap";

const CALLOUT_LABEL: Record<string, string> = {
  note: "Note",
  info: "Good to know",
  tip: "Tip",
  warning: "Please note",
  belief: "Tradition & belief",
  verify: "Needs verification",
};

function Component({ name, props, pageUrl }: { name: string; props: Record<string, string>; pageUrl: string }) {
  switch (name) {
    case "quick-info":
      return <QuickInfoCard />;
    case "timings-table":
      return <TimingsTable />;
    case "visitor-guidance":
      return <VisitorGuidanceTable />;
    case "trust-link":
      return <TrustLink />;
    case "distance-table":
      return <DistanceTable />;
    case "distance-card":
      return <DistanceCard id={props.id} />;
    case "route-options":
      return <RouteOptions id={props.id} />;
    case "stations":
      return <StationsTable />;
    case "airports":
      return <AirportsTable />;
    case "festival-list":
      return <FestivalList />;
    case "festival-calendar":
      return <FestivalCalendar initialYear={Number(props.year) || new Date().getFullYear()} />;
    case "distance-calculator":
      return <DistanceCalculator />;
    case "contact-form":
      return <ContactForm />;
    case "gallery":
      return <ImageGallery />;
    case "html-sitemap":
      return <HtmlSitemap />;
    case "ad":
      return <AdSlot slot="in-article" />;
    case "map":
      return (
        <div className="not-prose flex flex-wrap gap-3">
          <MapButton label={props.label} />
          {props.directions !== "false" && <MapButton directions label="Get directions" />}
        </div>
      );
    case "children": {
      const kids = getChildren(pageUrl);
      return (
        <CardGrid
          columns={kids.length === 4 ? 2 : 3}
          items={kids.map((k) => ({ href: k.url, title: shortTitle(k), text: k.meta.cardText ?? k.meta.description }))}
        />
      );
    }
    case "links": {
      // [[links urls="/a/,/b/"]] — curated card list from any pages.
      const urls = (props.urls ?? "").split(",").map((u) => u.trim()).filter(Boolean);
      return <CardGrid items={urls.map((u) => cardFor(u))} />;
    }
    case "blog-list": {
      const posts = getPosts().filter((p) => !props.category || p.meta.category === props.category);
      return <CardGrid items={posts.map((p) => ({ href: p.url, title: p.meta.title, text: p.meta.description }))} />;
    }
    case "faq-all": {
      return (
        <>
          {Object.entries({
            "About the temple": faqGroups.temple,
            "Timings & darshan": [...faqGroups.timings, ...faqGroups.darshan],
            "Travel": faqGroups.travel,
            "Shirdi & itineraries": faqGroups.shirdi,
            "Festivals & worship": [...faqGroups.festivals, ...faqGroups.shaniDev],
          }).map(([heading, keys], i) => (
            <FAQSection
              key={heading}
              id={`faq-${i}`}
              heading={heading}
              faqs={[...new Set(keys)].map((k) => faqData[k as FaqKey])}
            />
          ))}
        </>
      );
    }
    default:
      throw new Error(`Unknown content component [[${name}]] on ${pageUrl}`);
  }
}

export function cardFor(url: string) {
  const e = getEntryByUrl(url);
  if (e) return { href: url, title: shortTitle(e), text: e.meta.cardText ?? e.meta.description };
  const s = staticRoutes.find((r) => r.url === url);
  if (s) return { href: url, title: s.shortTitle, text: s.description };
  throw new Error(`Link card points to unknown page ${url}`);
}

export function ContentRenderer({ segments, pageUrl }: { segments: Segment[]; pageUrl: string }) {
  return (
    <div className="prose-content">
      {segments.map((s, i) => {
        if (s.type === "html") return <div key={i} className="md-block contents" dangerouslySetInnerHTML={{ __html: s.html }} />;
        if (s.type === "callout")
          return (
            <aside key={i} className={`callout callout-${s.variant}`} aria-label={s.title ?? CALLOUT_LABEL[s.variant]}>
              <p className="font-semibold text-ink-900">{s.title ?? CALLOUT_LABEL[s.variant]}</p>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </aside>
          );
        return (
          <div key={i} className="not-prose">
            <Component name={s.name} props={s.props} pageUrl={pageUrl} />
          </div>
        );
      })}
    </div>
  );
}
