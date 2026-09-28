/**
 * Reference sources. Pages cite these by key in their front matter
 * (`sources: [trust, district]`). Prefer primary and official sources.
 */
export interface Source {
  title: string;
  url: string;
  publisher: string;
  note?: string;
}

export const sources = {
  trust: {
    title: "Shri Shaneshwar Devasthan, Shanishingnapur",
    url: "https://www.shanidev.com/",
    publisher: "Shri Shaneshwar Devasthan (temple trust)",
    note: "The trust's own website — the best place to confirm timings and arrangements.",
  },
  trustContact: {
    title: "Contact — Shri Shaneshwar Devasthan",
    url: "https://www.shanidev.com/contact/",
    publisher: "Shri Shaneshwar Devasthan (temple trust)",
  },
  district: {
    title: "Shani Shingnapur — Ahilyanagar District",
    url: "https://ahmednagar.nic.in/en/public-utility/shani-shingnapur/",
    publisher: "District Administration, Ahilyanagar (Government of Maharashtra)",
  },
  districtAbout: {
    title: "About District — Ahilyanagar",
    url: "https://ahilyanagar.maharashtra.gov.in/en/about-district/",
    publisher: "District Administration, Ahilyanagar",
  },
  renaming: {
    title: "Maharashtra's Ahmednagar officially renamed to Ahilyanagar",
    url: "https://www.deccanherald.com/india/maharashtra/maharashtras-ahmednagar-officially-renamed-to-ahilyanagar-3220795",
    publisher: "Deccan Herald",
  },
  womenEntry2016: {
    title: "Shani Shingnapur row: how the tradition on women's entry changed",
    url: "https://www.business-standard.com/article/current-affairs/shani-shingnapur-row-5-things-to-know-about-how-the-400-year-old-gender-bias-was-broken-116040801078_1.html",
    publisher: "Business Standard (April 2016)",
  },
  ucoBank: {
    title: "God as guard: bank opens lockless branch",
    url: "https://www.hinduismtoday.com/hpi/2011/01/24/god-as-guard-bank-opens-lockless-branch/",
    publisher: "Hinduism Today (January 2011)",
  },
  maharashtraTourism: {
    title: "Maharashtra Tourism",
    url: "https://www.maharashtratourism.gov.in/",
    publisher: "Directorate of Tourism, Government of Maharashtra",
  },
  mtdc: {
    title: "Maharashtra Tourism Development Corporation",
    url: "https://www.mtdc.co/",
    publisher: "MTDC, Government of Maharashtra",
  },
  msrtc: {
    title: "MSRTC online reservation",
    url: "https://msrtc.maharashtra.gov.in/",
    publisher: "Maharashtra State Road Transport Corporation",
  },
  irctc: {
    title: "IRCTC train booking",
    url: "https://www.irctc.co.in/",
    publisher: "Indian Railway Catering and Tourism Corporation",
  },
  ntes: {
    title: "National Train Enquiry System",
    url: "https://enquiry.indianrail.gov.in/",
    publisher: "Indian Railways",
  },
  aai: {
    title: "Airports Authority of India",
    url: "https://www.aai.aero/",
    publisher: "Airports Authority of India",
  },
  saibaba: {
    title: "Shri Saibaba Sansthan Trust, Shirdi",
    url: "https://sai.org.in/",
    publisher: "Shri Saibaba Sansthan Trust",
  },
  trimbakeshwar: {
    title: "Nashik District official website",
    url: "https://nashik.gov.in/",
    publisher: "District Administration, Nashik",
  },
  ellora: {
    title: "Ellora Caves — UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/243/",
    publisher: "UNESCO",
  },
  imd: {
    title: "India Meteorological Department",
    url: "https://mausam.imd.gov.in/",
    publisher: "Government of India",
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof sources;
