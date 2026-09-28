import type { Verification } from "./temple";

/**
 * Travel data. All distances are ROAD distances to the temple and are given
 * as ranges because they depend on the exact route. Times are typical
 * private-vehicle driving times without long stops — never guarantees.
 */
export interface Origin {
  id: string;
  name: string;
  /** Other names people search with. */
  aka?: string;
  distanceKm: [number, number];
  driveHours: [number, number];
  status: Verification;
  routeSummary: string;
  routeOptions: string[];
  rail: string;
  air: string;
  bus: string;
  distancePage: string;
  travelPage?: string;
  nearbyPage?: string;
}

export const origins: Origin[] = [
  {
    id: "shirdi",
    name: "Shirdi",
    distanceKm: [65, 75],
    driveHours: [1.5, 2],
    status: "approximate",
    routeSummary:
      "Head south from Shirdi through Rahata towards Rahuri, then turn east towards Sonai and on to Shingnapur.",
    routeOptions: [
      "Via Rahata and Rahuri, then the Sonai road (the route most taxis use)",
      "Via Shrirampur and Nevasa side roads — sometimes suggested by map apps when the main road is congested",
    ],
    rail: "Sainagar Shirdi (SNSI) is Shirdi's own station; from there the temple is a road journey.",
    air: "Shirdi Airport at Kakadi is the closest airport to Shirdi town.",
    bus: "MSRTC buses and shared jeeps are reported to run between Shirdi and Shingnapur; frequency varies by season and day.",
    distancePage: "/distance/shirdi-to-shani-shingnapur/",
    travelPage: "/travel/from-shirdi/",
    nearbyPage: "/nearby-places/shirdi/",
  },
  {
    id: "ahilyanagar",
    name: "Ahilyanagar",
    aka: "Ahmednagar",
    distanceKm: [33, 40],
    driveHours: [0.75, 1.25],
    status: "approximate",
    routeSummary: "Shingnapur lies north-east of Ahilyanagar city; the drive is usually about an hour.",
    routeOptions: ["Direct district road from the city towards Sonai and Shingnapur"],
    rail: "Ahilyanagar (Ahmednagar) railway station, code ANG, is one of the two nearest major stations.",
    air: "No commercial airport in the city; the nearest options are Shirdi and Chhatrapati Sambhajinagar.",
    bus: "Ahilyanagar is a major MSRTC hub with regular services towards Sonai and Shingnapur.",
    distancePage: "/distance/ahmednagar-to-shani-shingnapur/",
    nearbyPage: "/nearby-places/ahmednagar/",
  },
  {
    id: "chhatrapati-sambhajinagar",
    name: "Chhatrapati Sambhajinagar",
    aka: "Aurangabad",
    distanceKm: [80, 90],
    driveHours: [1.75, 2.5],
    status: "approximate",
    routeSummary:
      "Follow the Chhatrapati Sambhajinagar–Ahilyanagar highway south-west and turn off towards Shingnapur in the Ghodegaon area.",
    routeOptions: ["Chhatrapati Sambhajinagar–Ahilyanagar highway, turning off near Ghodegaon (confirm the turn on your map)"],
    rail: "Chhatrapati Sambhajinagar station (formerly Aurangabad, code AWB) has long-distance trains; onward travel is by road.",
    air: "Chhatrapati Sambhajinagar Airport (IXU) is one of the two nearest airports, roughly 90 km from the temple.",
    bus: "MSRTC buses run on the Chhatrapati Sambhajinagar–Ahilyanagar corridor; you may need to change for Shingnapur.",
    distancePage: "/distance/chhatrapati-sambhajinagar-to-shani-shingnapur/",
    travelPage: "/travel/from-chhatrapati-sambhajinagar/",
    nearbyPage: "/nearby-places/chhatrapati-sambhajinagar/",
  },
  {
    id: "pune",
    name: "Pune",
    distanceKm: [155, 170],
    driveHours: [3.5, 4.5],
    status: "approximate",
    routeSummary: "Take the Pune–Ahilyanagar highway via Shikrapur and Shirur to Ahilyanagar, then continue about 35 km to Shingnapur.",
    routeOptions: [
      "Pune → Shikrapur → Shirur → Ahilyanagar → Shingnapur (the usual route)",
      "Pune → Alephata → Sangamner → Rahuri → Shingnapur, if combining with Shirdi",
    ],
    rail: "Pune Junction has trains to Ahilyanagar; the rest of the journey is by road.",
    air: "Pune Airport (PNQ) has the widest choice of flights of the airports within a few hours' drive.",
    bus: "Frequent MSRTC buses run Pune–Ahilyanagar; change there for Shingnapur.",
    distancePage: "/distance/pune-to-shani-shingnapur/",
    travelPage: "/travel/from-pune/",
  },
  {
    id: "nashik",
    name: "Nashik",
    distanceKm: [145, 170],
    driveHours: [3, 4],
    status: "approximate",
    routeSummary: "Drive east via Sinnar towards Shirdi, then south via Rahuri to Shingnapur.",
    routeOptions: [
      "Nashik → Sinnar → Shirdi → Rahuri → Shingnapur (lets you stop at Shirdi on the way)",
      "Nashik → Sinnar → Sangamner → Rahuri → Shingnapur",
    ],
    rail: "Nashik Road station (NK) is on the main Mumbai–Bhusawal line; there is no direct rail link to Shingnapur.",
    air: "Nashik's airport at Ozar has limited scheduled flights; Shirdi Airport is also within reach.",
    bus: "MSRTC buses run Nashik–Shirdi frequently; continue from Shirdi by bus, shared jeep or taxi.",
    distancePage: "/distance/nashik-to-shani-shingnapur/",
    travelPage: "/travel/from-nashik/",
    nearbyPage: "/nearby-places/nashik/",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    distanceKm: [280, 330],
    driveHours: [6, 8],
    status: "approximate",
    routeSummary:
      "There are three common road routes — via Nashik and Shirdi, via Pune and Ahilyanagar, or via the Malshej Ghat and Alephata. Each is roughly 280–330 km.",
    routeOptions: [
      "Via the Mumbai–Nashik highway, Sinnar and Shirdi (convenient if visiting Shirdi too)",
      "Via the Mumbai–Pune Expressway, Pune and Ahilyanagar",
      "Via Kalyan, Malshej Ghat and Alephata (scenic, but slower in the monsoon)",
    ],
    rail: "Trains from Mumbai reach Ahilyanagar (via Pune/Daund) and Sainagar Shirdi; continue by road.",
    air: "Most visitors from Mumbai drive or take a train; flights to Shirdi Airport are an option when available.",
    bus: "MSRTC and private buses run from Mumbai to Shirdi and to Ahilyanagar.",
    distancePage: "/distance/mumbai-to-shani-shingnapur/",
    travelPage: "/travel/from-mumbai/",
  },
];

export const railwayStations = [
  { name: "Rahuri (RRI)", distanceKm: "about 30–35 km", note: "Closest station, but few long-distance trains stop here." },
  { name: "Ahilyanagar / Ahmednagar (ANG)", distanceKm: "about 35 km", note: "Best-connected nearby station, with trains from Pune, Mumbai and beyond." },
  { name: "Belapur (BAP), serving Shrirampur", distanceKm: "about 50–55 km", note: "On the Daund–Manmad line." },
  { name: "Sainagar Shirdi (SNSI)", distanceKm: "about 70–75 km", note: "Useful if you are visiting Shirdi first." },
];

export const airports = [
  { name: "Shirdi Airport (SAG), Kakadi", distanceKm: "about 70–90 km", note: "Closest airport; limited routes that change seasonally." },
  { name: "Chhatrapati Sambhajinagar Airport (IXU)", distanceKm: "about 90 km", note: "Regular domestic flights." },
  { name: "Pune Airport (PNQ)", distanceKm: "about 160–170 km", note: "Wide choice of domestic flights." },
  { name: "Mumbai – Chhatrapati Shivaji Maharaj International (BOM)", distanceKm: "about 300 km", note: "Best for international arrivals." },
];

export function formatRange([a, b]: [number, number], unit: string): string {
  return a === b ? `about ${a} ${unit}` : `about ${a}–${b} ${unit}`;
}

export function formatHours([a, b]: [number, number]): string {
  if (a < 1) return `about ${Math.round(a * 60)} minutes to ${b === 1 ? "1 hour" : `${b} hours`}`.replace("1.25 hours", "1 hour 15 minutes");
  return `about ${a}–${b} hours`;
}

export function getOrigin(id: string): Origin | undefined {
  return origins.find((o) => o.id === id);
}
