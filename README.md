# ShaniShingnapurTemple.com

An independent, SEO-focused informational website about Shani Shingnapur Temple, Maharashtra —
temple, history, darshan, Shani Dev, travel, pilgrimage itineraries, festivals and nearby places.

> The site is **not** the official website of Shri Shaneshwar Devasthan (the temple trust) or any
> government body, and it says so throughout.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) — every content page is statically generated.
- **Tailwind CSS 4** — design tokens in `src/app/globals.css`.
- **Markdown content** (`content/`) parsed at build time with `gray-matter` + `marked`.
- No database, no CMS, no client-side rendering of important text. Only small interactive widgets
  (search, trip planner, distance calculator, festival calendar, contact form, share buttons) ship JS.

## Commands

```bash
npm install
npm run dev         # local development
npm run build       # production build (fails on unknown tokens/components/links)
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run validate    # crawls the production build and checks SEO + links (run after build)
npm run check       # all of the above
```

## Project structure

```
content/
  pages/            Markdown pages → URL mirrors the path (temple/history.md → /temple/history/)
  blog/             Blog posts → /blog/<file-name>/
src/
  data/             ← Single source of truth for facts (edit these, not components)
    site.ts           site name, URL, disclaimers, analytics IDs (from env)
    temple.ts         templeInfo, timings, visitorGuidance — each fact has a verification status
    travel.ts         origins (distances, drive times, routes), stations, airports
    festivals.ts      festival definitions + verified date overrides
    faqs.ts           central FAQ bank and per-page groups
    sources.ts        reference sources cited by pages
    navigation.ts     header, footer and quick links
    gallery.ts        licensed/original photos for /gallery/
  lib/
    content.ts        Markdown loader/renderer (headings → TOC, tables, callouts, shortcodes)
    tokens.ts         {{token}} resolver
    astro.ts          Amavasya / Shani Amavasya / Shani Jayanti calculations
    seo.ts            metadata + JSON-LD builders
    routes.ts         non-Markdown routes, blog categories, breadcrumbs
  components/       Header, Footer, Breadcrumbs, FAQSection, TableOfContents, TripPlanner, …
  app/              Routes, sitemap.ts, robots.ts, OG image route, search index, contact API
scripts/seo-validate.mjs   Automated SEO & broken-link checks
```

## Editing content

### Front matter

```yaml
---
title: "Visible H1"
metaTitle: "<title> tag (≤ ~65 chars)"
shortTitle: "Breadcrumb/card label"
description: "Meta description and page lede (≤ ~160 chars)"
cardText: "Short text for hub cards"
updated: 2026-09-28        # shown as "Last updated" — change it when content changes
published: 2026-09-28
quickAnswer: "Direct answer shown at the top (featured-snippet friendly)"
disclaimer: temple | travel | both
faqs: travel               # a group from src/data/faqs.ts, or a list of keys
sources: [trust, district]  # keys from src/data/sources.ts
related: [/temple/timings/, /travel/]
schema: [TouristAttraction, HinduTemple]   # only on pages about the temple itself
noindex: true              # keeps a page out of the index and sitemap
order: 2                   # order within a hub
category: travel           # blog posts only
---
```

### Tokens — never duplicate facts

Write `{{distance.shirdi}}`, `{{time.pune}}`, `{{route.nashik}}`, `{{temple.district}}`,
`{{temple.officialWebsite}}`, `{{site.travelDisclaimer}}`, `{{map}}`. Values come from `src/data/`.
An unknown token fails the build.

### Shortcodes (on their own line)

`[[quick-info]]` `[[timings-table]]` `[[visitor-guidance]]` `[[trust-link]]` `[[distance-table]]`
`[[distance-card id=shirdi]]` `[[route-options id=pune]]` `[[stations]]` `[[airports]]`
`[[festival-list]]` `[[festival-calendar]]` `[[distance-calculator]]` `[[map]]` `[[children]]`
`[[links urls="/a/,/b/"]]` `[[blog-list category=travel]]` `[[faq-all]]` `[[gallery]]`
`[[contact-form]]` `[[html-sitemap]]` `[[ad]]`

### Callouts

```md
:::belief According to local tradition
Text…
:::
```

Variants: `note`, `info`, `tip`, `warning`, `belief` (tradition/belief), `verify` (needs verification).

### Updating a fact

1. Edit the value in `src/data/*.ts`.
2. Set its `status` to `"sourced"` once confirmed (e.g. from the trust), and add the source to `sources.ts`.
3. Update `updated:` on the pages that discuss it.

### Festival dates

Dates are **calculated** (`src/lib/astro.ts`) and labelled as such. When the trust or a reliable
panchang publishes a date, add it to `festivalDateOverrides` in `src/data/festivals.ts` — it replaces
the calculation and shows as confirmed.

## Deployment (Vercel)

1. Import the repository into Vercel (framework preset: Next.js). No build settings needed.
2. Add environment variables from `.env.example` as required. All are optional:
   - `NEXT_PUBLIC_SITE_URL` (defaults to `https://shanishingnapurtemple.com`)
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GTM_ID` — analytics load only when set
   - `NEXT_PUBLIC_GSC_VERIFICATION` — Search Console HTML-tag token
   - `NEXT_PUBLIC_ADSENSE_CLIENT` — ad slots render only when set
   - `CONTACT_WEBHOOK_URL` — where contact-form messages are forwarded (Formspree, Make, Zapier, Slack…).
     Without it the form politely reports that it is unavailable.
3. Domains: add `shanishingnapurtemple.com` **and** `www.shanishingnapurtemple.com`; set the apex as
   primary and redirect `www` to it (Vercel does this at the edge). `next.config.ts` also contains a
   host-based www → apex redirect as a fallback. HTTPS is automatic on Vercel.
4. After the first deploy: submit `https://shanishingnapurtemple.com/sitemap.xml` in Google Search Console.

## Redirects

`next.config.ts` holds 301/308 redirects, including the legacy `/visitor-info` → `/temple/timings/`.
Add any other URLs from the previous site there before launch.

## Facts awaiting verification

See the verification statuses in `src/data/temple.ts`. At the time of writing, these are **not**
confirmed and are labelled on the site accordingly:

- Current darshan hours and aarti times (reported only)
- Pooja/abhishek schedules and any charges
- Dress code (none confirmed)
- Photography rules
- Parking locations and charges
- Trust accommodation types, prices and booking process
- Prasadalaya timings
- Trust founding year (reported as 1963)
- Bus/shared-jeep frequencies
- Assistance for elderly/disabled devotees

## Images

The site currently uses only original SVG illustrations and generated social cards. The gallery is
structured (`src/data/gallery.ts`) but empty and `noindex` until original or properly licensed
photographs are added with credits.
