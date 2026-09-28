export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const mainNav: NavItem[] = [
  {
    label: "Temple",
    href: "/temple/",
    children: [
      { label: "Temple overview", href: "/temple/" },
      { label: "History", href: "/temple/history/" },
      { label: "Pooja & worship", href: "/temple/pooja/" },
      { label: "Aarti", href: "/temple/aarti/" },
      { label: "Shani Dev", href: "/shani-dev/" },
    ],
  },
  { label: "Timings", href: "/temple/timings/" },
  { label: "Darshan", href: "/temple/darshan/" },
  {
    label: "Travel",
    href: "/travel/",
    children: [
      { label: "How to reach", href: "/travel/how-to-reach/" },
      { label: "From Shirdi", href: "/travel/from-shirdi/" },
      { label: "Distances", href: "/distance/" },
      { label: "Accommodation", href: "/travel/accommodation/" },
      { label: "Pilgrimage itineraries", href: "/pilgrimage/" },
    ],
  },
  { label: "Festivals", href: "/festivals/" },
  { label: "Nearby Places", href: "/nearby-places/" },
  { label: "Guides", href: "/guides/" },
  { label: "Blog", href: "/blog/" },
];

export const quickLinks = [
  { label: "Timings", href: "/temple/timings/" },
  { label: "How to reach", href: "/travel/how-to-reach/" },
  { label: "From Shirdi", href: "/travel/from-shirdi/" },
  { label: "Darshan guide", href: "/temple/darshan/" },
  { label: "Nearby places", href: "/nearby-places/" },
  { label: "Plan your visit", href: "/plan-your-visit/" },
];

export const footerNav = [
  {
    heading: "Explore",
    links: [
      { label: "Temple", href: "/temple/" },
      { label: "History", href: "/temple/history/" },
      { label: "Timings", href: "/temple/timings/" },
      { label: "Darshan", href: "/temple/darshan/" },
      { label: "Shani Dev", href: "/shani-dev/" },
      { label: "Festivals", href: "/festivals/" },
      { label: "Nearby Places", href: "/nearby-places/" },
      { label: "Blog", href: "/blog/" },
    ],
  },
  {
    heading: "Plan",
    links: [
      { label: "Travel guide", href: "/travel/" },
      { label: "How to reach", href: "/travel/how-to-reach/" },
      { label: "Distances", href: "/distance/" },
      { label: "Shirdi + Shani Shingnapur", href: "/pilgrimage/shirdi-shani-shingnapur/" },
      { label: "Plan your visit", href: "/plan-your-visit/" },
      { label: "Festival calendar", href: "/festivals/festival-calendar/" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Visitor guides", href: "/guides/" },
      { label: "FAQs", href: "/faq/" },
      { label: "Gallery", href: "/gallery/" },
      { label: "Search", href: "/search/" },
      { label: "Sitemap", href: "/sitemap/" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About us", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Editorial policy", href: "/editorial-policy/" },
      { label: "How we research", href: "/how-we-research/" },
      { label: "Privacy policy", href: "/privacy-policy/" },
      { label: "Terms", href: "/terms/" },
      { label: "Disclaimer", href: "/disclaimer/" },
    ],
  },
];
