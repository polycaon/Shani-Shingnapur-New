import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/data/site";
import { templeInfo } from "@/data/temple";
import type { Faq } from "@/data/faqs";

export function ogImageFor(url: string): string {
  const key = url === "/" ? "home" : url.split("/").filter(Boolean).join("--");
  return `/og/${key}.png`;
}

export function buildMetadata(opts: {
  url: string;
  title: string;
  description: string;
  type?: "website" | "article";
  noindex?: boolean;
  published?: string;
  updated?: string;
}): Metadata {
  const image = ogImageFor(opts.url);
  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: absoluteUrl(opts.url) },
    robots: opts.noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: opts.type ?? "website",
      url: absoluteUrl(opts.url),
      title: opts.title,
      description: opts.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      ...(opts.type === "article"
        ? { publishedTime: opts.published ?? opts.updated, modifiedTime: opts.updated }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/* ---------------------------- JSON-LD builders ---------------------------- */

const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;
const TEMPLE_ID = `${siteConfig.url}/#shani-shingnapur-temple`;

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: absoluteUrl("/"),
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        description: siteConfig.description,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search/")}?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        // The organisation that publishes this independent guide — NOT the temple trust.
        "@type": "Organization",
        "@id": ORG_ID,
        name: "ShaniShingnapurTemple.com",
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
        description: siteConfig.independentNotice,
        ...(siteConfig.social.length ? { sameAs: siteConfig.social.map((s) => s.url) } : {}),
      },
    ],
  };
}

/** The temple as a place. Only properties visible on the page are included. */
export function templeSchema(types: string[] = ["TouristAttraction", "HinduTemple"]) {
  return {
    "@context": "https://schema.org",
    "@type": types,
    "@id": TEMPLE_ID,
    name: templeInfo.name,
    alternateName: [templeInfo.formalName, ...templeInfo.alternateNames],
    description:
      "Open-air shrine of Shani Dev in the village of Shani Shingnapur, Maharashtra, where the deity is worshipped as a self-manifested black stone on a raised platform.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shani Shingnapur",
      addressRegion: templeInfo.state,
      postalCode: templeInfo.pinCode.value,
      addressCountry: "IN",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: `${templeInfo.district} district, ${templeInfo.state}`,
    },
    hasMap: templeInfo.mapUrl,
    sameAs: [templeInfo.officialWebsite.value],
    isAccessibleForFree: true,
    publicAccess: true,
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.url),
    })),
  };
}

export function articleSchema(opts: {
  url: string;
  title: string;
  description: string;
  published?: string;
  updated: string;
  blog?: boolean;
  about?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.blog ? "BlogPosting" : "Article",
    headline: opts.title.slice(0, 110),
    description: opts.description,
    mainEntityOfPage: absoluteUrl(opts.url),
    url: absoluteUrl(opts.url),
    image: absoluteUrl(ogImageFor(opts.url)),
    datePublished: opts.published ?? opts.updated,
    dateModified: opts.updated,
    inLanguage: "en-IN",
    author: { "@type": "Organization", name: siteConfig.editorialTeam, url: absoluteUrl("/about/") },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    ...(opts.about ? { about: { "@id": TEMPLE_ID } } : {}),
  };
}

export function faqSchema(faqs: Faq[]) {
  const strip = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: strip(f.a) },
    })),
  };
}
