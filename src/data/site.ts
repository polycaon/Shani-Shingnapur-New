/**
 * Global site configuration. Change values here, not in components.
 */
export const siteConfig = {
  name: "Shani Shingnapur Temple",
  shortName: "Shani Shingnapur Guide",
  domain: "shanishingnapurtemple.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://shanishingnapurtemple.com").replace(/\/$/, ""),
  tagline: "An independent guide to Shani Shingnapur — temple, darshan, travel and pilgrimage",
  description:
    "An independent, carefully researched guide to Shani Shingnapur Temple in Maharashtra: history, darshan, worship, festivals, travel from Shirdi, Pune, Mumbai and Nashik, and nearby places.",
  locale: "en_IN",
  language: "en",
  /** Editorial identity used for bylines. No individual credentials are claimed. */
  editorialTeam: "ShaniShingnapurTemple.com Editorial Team",
  /** Date the site content was last reviewed as a whole (ISO). */
  contentReviewed: "2026-09-28",
  /** Public contact channel. Leave null until a real, monitored address exists. */
  contactEmail: null as string | null,
  /** Only add genuine, owned social profiles. */
  social: [] as { name: string; url: string }[],
  independentNotice:
    "ShaniShingnapurTemple.com is an independent informational website. It is not the official website of Shri Shaneshwar Devasthan, the temple trust, or any government authority.",
  templeDisclaimer:
    "Temple timings, rituals, visitor procedures and other arrangements may change. Please verify current information before travelling.",
  travelDisclaimer:
    "Travel times and distances can vary depending on the route, traffic, weather and transportation conditions.",
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
    gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
    adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  },
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
