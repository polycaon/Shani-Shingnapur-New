/**
 * Central temple facts. Every fact carries a verification status so that
 * pages can show honest labels and editors can see what still needs checking.
 *
 *  - "sourced":    corroborated by public sources listed in `sources`.
 *  - "approximate": a range or estimate; exact values vary.
 *  - "unverified": widely reported but not yet confirmed with the temple trust.
 *  - "pending":    not known — do not display a value.
 */
export type Verification = "sourced" | "approximate" | "unverified" | "pending";

export interface Fact<T = string> {
  value: T;
  status: Verification;
  note?: string;
}

export const templeInfo = {
  name: "Shani Shingnapur Temple",
  formalName: "Shri Shaneshwar Devasthan, Shani Shingnapur",
  alternateNames: ["Shani Shinganapur", "Shanishingnapur", "Shaneshwar Temple", "Shri Shanaishwar Devasthan"],
  village: "Shani Shingnapur (Shingnapur)",
  nearbyTown: "Sonai",
  taluka: "Nevasa",
  district: "Ahilyanagar",
  districtFormerName: "Ahmednagar",
  districtRenamed: "October 2024",
  state: "Maharashtra",
  country: "India",
  pinCode: { value: "414105", status: "sourced", note: "As listed in the trust's published postal address." } as Fact,
  deity: "Shani Dev (Shanaishchara), the deity associated with the planet Saturn",
  templeType: "Open-air shrine to a self-manifested (swayambhu) black stone",
  worshipDay: "Saturday (Shanivar)",
  majorFestival: "Shani Jayanti",
  idol: {
    value: "A black stone about five and a half to six feet tall, standing on an open, raised platform",
    status: "sourced",
    note: "Commonly described as roughly 5 ft 9 in tall; published measurements vary slightly.",
  } as Fact,
  trust: {
    value: "Shri Shaneshwar Devasthan Trust",
    status: "sourced",
  } as Fact,
  trustEstablished: {
    value: "1963",
    status: "unverified",
    note: "Reported by third-party directories; confirm with the trust before citing.",
  } as Fact,
  officialWebsite: {
    value: "https://www.shanidev.com/",
    status: "sourced",
    note: "Website published by Shri Shaneshwar Devasthan. We are not affiliated with it.",
  } as Fact,
  /** A search-based map link. We deliberately avoid hard-coding coordinates. */
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Shri+Shaneshwar+Devasthan+Shani+Shingnapur+Maharashtra",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Shri+Shaneshwar+Devasthan+Shani+Shingnapur+Maharashtra",
  nearbyPilgrimage: ["Shirdi", "Nashik", "Trimbakeshwar", "Grishneshwar (near Ellora)"],
} as const;

/**
 * Timings. Public third-party sources disagree (some describe the shrine as
 * accessible round the clock, others give fixed opening hours), so nothing
 * here is marked as verified. Replace `value` and set status to "sourced"
 * once confirmed with Shri Shaneshwar Devasthan.
 */
export const timings = {
  lastChecked: "2026-09-28",
  summary:
    "Published sources disagree on exact hours. Several travel guides describe the shrine as open for darshan for most of the day, with the main aartis in the early morning and around sunset. We have not yet confirmed a current schedule with the temple trust.",
  rows: [
    {
      label: "Darshan hours",
      value: "Reported by many guides as early morning to late night; some describe the shrine as open round the clock",
      status: "unverified",
    },
    { label: "Morning aarti", value: "Commonly reported around 4:30 AM", status: "unverified" },
    { label: "Midday aarti", value: "Reported by some sources around noon", status: "unverified" },
    { label: "Evening aarti", value: "Commonly reported at sunset (time shifts through the year)", status: "unverified" },
    { label: "Abhishek / oil offering", value: "Arrangements are set by the trust — check on arrival", status: "pending" },
    { label: "Special pooja booking", value: "Check with the trust office", status: "pending" },
  ] satisfies { label: string; value: string; status: Verification }[],
};

/** Visitor rules that are commonly published but must be rechecked before relying on them. */
export const visitorGuidance = {
  dressCode: {
    value: "No formal dress code has been confirmed by us. Modest, clean clothing is customary at Hindu shrines.",
    status: "pending",
  } as Fact,
  photography: {
    value: "Rules on photography near the shrine platform can change. Follow signs and staff instructions.",
    status: "pending",
  } as Fact,
  platformAccess: {
    value:
      "Since April 2016 the trust has allowed all devotees, men and women, onto the shrine platform, following a Bombay High Court direction. Crowd-control arrangements on the day decide how close visitors can go.",
    status: "sourced",
  } as Fact,
  parking: {
    value: "Parking areas exist near the temple approach; exact locations and any charges have not been verified.",
    status: "unverified",
  } as Fact,
  fees: {
    value: "We have not verified any darshan or pooja fees. Do not pay anyone claiming to sell 'VIP' access without an official receipt.",
    status: "pending",
  } as Fact,
};
