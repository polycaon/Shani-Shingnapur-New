import type { Verification } from "./temple";

export interface FestivalInfo {
  id: string;
  name: string;
  page: string;
  when: string;
  summary: string;
  crowd: string;
}

export const festivals: FestivalInfo[] = [
  {
    id: "shani-jayanti",
    name: "Shani Jayanti",
    page: "/festivals/shani-jayanti/",
    when: "Amavasya (new moon) of Vaishakha in the amanta calendar used in Maharashtra — usually late May or early June",
    summary: "Observed as the appearance day of Shani Dev and the most important annual occasion at Shingnapur.",
    crowd: "Very heavy. Expect long queues, traffic control and restricted vehicle access near the village.",
  },
  {
    id: "shani-amavasya",
    name: "Shani Amavasya",
    page: "/festivals/shani-amavasya/",
    when: "Any Amavasya that falls on a Saturday — typically one to three times a year",
    summary: "A new moon on Shani's own weekday, traditionally regarded as especially auspicious for Shani worship.",
    crowd: "Very heavy, often comparable to Shani Jayanti.",
  },
  {
    id: "saturday",
    name: "Saturdays",
    page: "/festivals/saturday/",
    when: "Every week",
    summary: "Saturday (Shanivar) is Shani Dev's day, and the busiest regular day of the week at the temple.",
    crowd: "Heavy, especially in the morning and on long weekends.",
  },
];

/**
 * Verified dates override the calculated ones. When the trust or a reliable
 * panchang publishes a date, add it here with status "sourced".
 */
export const festivalDateOverrides: Record<
  number,
  { shaniJayanti?: { date: string; status: Verification; source?: string } }
> = {};
