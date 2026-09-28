import { templeInfo } from "./temple";
import { getOrigin, formatRange } from "./travel";

export interface Faq {
  q: string;
  /** Markdown allowed (links, emphasis). Keep answers direct: answer first, detail after. */
  a: string;
}

const km = (id: string) => {
  const o = getOrigin(id);
  return o ? formatRange(o.distanceKm, "km") : "";
};

/**
 * Central FAQ bank. Pages reference questions by key so an answer only
 * ever lives in one place.
 */
export const faqData = {
  location: {
    q: "Where is Shani Shingnapur Temple located?",
    a: `Shani Shingnapur Temple is in the village of Shani Shingnapur, near Sonai, in ${templeInfo.taluka} taluka of ${templeInfo.district} district (formerly ${templeInfo.districtFormerName}), ${templeInfo.state}. It is roughly ${km("ahilyanagar")} from Ahilyanagar city and ${km("shirdi")} from Shirdi by road. [Open the location in Google Maps](${templeInfo.mapUrl}).`,
  },
  famous: {
    q: "What is Shani Shingnapur famous for?",
    a: "It is famous for its open-air shrine to Shani Dev — a self-manifested black stone on a raised platform with no roof or enclosing walls — and for the village tradition of houses without conventional doors or locks, which local belief attributes to Shani Dev's protection. See [why Shani Shingnapur is famous](/blog/shani-shingnapur-village-without-doors/).",
  },
  timings: {
    q: "What are the Shani Shingnapur temple timings?",
    a: "Published sources disagree, and we have not yet confirmed a current schedule with the temple trust. Many travel guides describe the shrine as open for darshan for most of the day, with aartis in the early morning and around sunset. Check the trust's own website or ask locally before planning around a specific time. Details: [temple timings](/temple/timings/).",
  },
  shirdiDistance: {
    q: "How far is Shani Shingnapur from Shirdi?",
    a: `Shani Shingnapur is ${km("shirdi")} from Shirdi by road, usually a drive of about 1.5–2 hours. The exact distance depends on the route you take. See [Shirdi to Shani Shingnapur](/distance/shirdi-to-shani-shingnapur/).`,
  },
  reach: {
    q: "How can I reach Shani Shingnapur?",
    a: "Shani Shingnapur has no railway station or airport of its own, so the last part of every journey is by road. The nearest railway stations are Rahuri and Ahilyanagar (both about 30–35 km); the nearest airports are Shirdi and Chhatrapati Sambhajinagar. From there, taxis, MSRTC buses and shared jeeps cover the final stretch. Full guide: [how to reach Shani Shingnapur](/travel/how-to-reach/).",
  },
  shaniJayanti: {
    q: "What is Shani Jayanti?",
    a: "Shani Jayanti is the day Hindu tradition observes as the birth or appearance day of Shani Dev. In Maharashtra it falls on the Amavasya (new moon) that ends the lunar month of Vaishakha, usually in late May or early June, and it is the busiest day of the year at Shingnapur. See [Shani Jayanti](/festivals/shani-jayanti/).",
  },
  withShirdi: {
    q: "Can Shani Shingnapur be visited along with Shirdi?",
    a: "Yes. Many pilgrims combine the two. A same-day round trip from Shirdi is common because the drive is about 1.5–2 hours each way; allow a full day if you also want time at other stops. See the [one-day Shirdi–Shani Shingnapur itinerary](/pilgrimage/shirdi-shani-shingnapur-one-day-trip/).",
  },
  women: {
    q: "Can women go onto the shrine platform at Shani Shingnapur?",
    a: "Yes. Since April 2016 the temple trust has allowed all devotees, women and men, onto the platform, after the Bombay High Court said women could not be denied entry where men were allowed. On busy days crowd-control arrangements decide how close any visitor can go. Background: [temple history](/temple/history/).",
  },
  bestTime: {
    q: "What is the best time to visit Shani Shingnapur?",
    a: "For a calmer visit, choose a weekday morning between October and February, when the weather is mild. Saturdays, Shani Amavasya and Shani Jayanti are the most significant days for worship but also the most crowded. See [best time to visit](/blog/best-time-to-visit-shani-shingnapur/).",
  },
  howLong: {
    q: "How much time is needed at Shani Shingnapur?",
    a: "On an ordinary weekday, most visitors spend one to two hours for darshan and a walk around the village. On Saturdays and festival days, queues can stretch this to several hours.",
  },
  nearestStation: {
    q: "What is the nearest railway station to Shani Shingnapur?",
    a: "Rahuri is the closest station (about 30–35 km), but few long-distance trains stop there. Ahilyanagar (Ahmednagar, ANG), about 35 km away, is usually the more practical choice. See [by train](/travel/by-train/).",
  },
  nearestAirport: {
    q: "What is the nearest airport to Shani Shingnapur?",
    a: "Shirdi Airport at Kakadi (about 70–90 km) and Chhatrapati Sambhajinagar Airport (about 90 km) are the closest. Pune Airport (about 160–170 km) has more flights. See [by air](/travel/by-air/).",
  },
  official: {
    q: "Is this the official Shani Shingnapur temple website?",
    a: "No. ShaniShingnapurTemple.com is an independent informational guide. It is not run by Shri Shaneshwar Devasthan or any government body, and it does not sell darshan, pooja or accommodation bookings. See [about us](/about/).",
  },
  dressCode: {
    q: "Is there a dress code at Shani Shingnapur?",
    a: "We have not been able to confirm a formal dress code published by the trust. Modest, clean clothing is customary at Hindu shrines and is a safe choice. Follow any instructions posted at the temple or given by staff on the day.",
  },
  oil: {
    q: "Why do devotees offer oil to Shani Dev?",
    a: "Offering oil — traditionally sesame (til) oil — is one of the most widespread forms of Shani worship. Devotional literature links it to stories of Shani Dev being soothed with oil. At Shingnapur, how oil is offered is decided by the trust's arrangements on the day. See the [pooja and worship guide](/temple/pooja/).",
  },
  sadeSati: {
    q: "Will visiting Shani Shingnapur remove Sade Sati or Shani dosha?",
    a: "Many devotees visit during Sade Sati or when astrologers mention Shani dosha, and they believe worship brings relief. That is a matter of faith: no outcome can be promised, and important health, legal or financial decisions should not depend on it. See [understanding Sade Sati](/blog/understanding-sade-sati/).",
  },
  accommodation: {
    q: "Is there accommodation at Shani Shingnapur?",
    a: "Yes. There are lodging options in and around the village, including facilities operated by the temple trust and private lodges, and many more hotels in Shirdi and Ahilyanagar. We do not list prices because they change. See [accommodation](/travel/accommodation/).",
  },
  parking: {
    q: "Is parking available at Shani Shingnapur?",
    a: "There are parking areas along the temple approach. We have not verified current locations or charges, and on festival days vehicles may be stopped further away. See [parking](/travel/parking/).",
  },
  doors: {
    q: "Is it true that houses in Shani Shingnapur have no doors?",
    a: "The village is known for houses with door frames but no conventional locking doors, a practice rooted in the belief that Shani Dev protects the village. In recent decades some buildings have added doors or discreet security, so do not assume every building follows the tradition. See [the village without doors](/blog/shani-shingnapur-village-without-doors/).",
  },
} satisfies Record<string, Faq>;

export type FaqKey = keyof typeof faqData;

export const faqGroups: Record<string, FaqKey[]> = {
  home: ["location", "famous", "timings", "shirdiDistance", "reach", "shaniJayanti", "withShirdi", "bestTime", "official"],
  temple: ["location", "famous", "timings", "women", "dressCode", "official"],
  timings: ["timings", "howLong", "bestTime", "dressCode"],
  darshan: ["howLong", "women", "dressCode", "oil"],
  pooja: ["oil", "sadeSati", "timings"],
  travel: ["reach", "nearestStation", "nearestAirport", "shirdiDistance", "parking", "accommodation"],
  shirdi: ["shirdiDistance", "withShirdi", "howLong"],
  festivals: ["shaniJayanti", "bestTime", "howLong"],
  shaniDev: ["sadeSati", "oil", "shaniJayanti"],
};
