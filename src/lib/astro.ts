/**
 * Lightweight astronomical calculations used to *estimate* lunar festival
 * dates (Amavasya, Shani Amavasya, Shani Jayanti) for any year.
 *
 * Algorithms follow Jean Meeus, "Astronomical Algorithms" (low-precision
 * solar and truncated lunar theories). Accuracy is a few minutes, which is
 * enough to pick the civil day in most cases — but panchangs use their own
 * conventions and local sunrise, so results are always presented as
 * "calculated — confirm with a local panchang".
 */

const DEG = Math.PI / 180;
const norm360 = (x: number) => ((x % 360) + 360) % 360;
const wrap180 = (x: number) => {
  const n = norm360(x);
  return n > 180 ? n - 360 : n;
};

/** Reference point for sunrise in the Ahilyanagar district region. */
const REF_LAT = 19.3;
const REF_LON = 74.8;
const IST_OFFSET_DAYS = 5.5 / 24;

export const dateToJd = (d: Date) => d.getTime() / 86400000 + 2440587.5;
export const jdToDate = (jd: number) => new Date((jd - 2440587.5) * 86400000);

/** Apparent geocentric longitude of the Sun, degrees (tropical). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG) +
    0.000289 * Math.sin(3 * M * DEG);
  const omega = 125.04 - 1934.136 * T;
  return norm360(L0 + C - 0.00569 - 0.00478 * Math.sin(omega * DEG));
}

/** Geocentric longitude of the Moon, degrees (principal periodic terms). */
export function moonLongitude(jd: number): number {
  const T = (jd - 2451545) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const E = 1 - 0.002516 * T;
  // [D, M, M', F, coefficient in 1e-6 degrees]
  const terms: [number, number, number, number, number][] = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
    [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
    [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
    [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
    [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
    [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
    [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
    [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
    [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
    [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
    [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
    [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
    [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
  ];
  let sum = 0;
  for (const [d, m, mp, f, c] of terms) {
    const arg = (d * D + m * M + mp * Mp + f * F) * DEG;
    const e = Math.abs(m) === 1 ? E : Math.abs(m) === 2 ? E * E : 1;
    sum += c * e * Math.sin(arg);
  }
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  sum += 3958 * Math.sin(A1 * DEG) + 1962 * Math.sin((Lp - F) * DEG) + 318 * Math.sin(A2 * DEG);
  const omega = 125.04452 - 1934.136261 * T;
  return norm360(Lp + sum / 1e6 - 0.00478 * Math.sin(omega * DEG));
}

const elongation = (jd: number) => norm360(moonLongitude(jd) - sunLongitude(jd));

/** Solve for the time near `guess` when the Moon–Sun elongation equals `target`. */
function solveElongation(target: number, guess: number): number {
  let jd = guess;
  for (let i = 0; i < 20; i++) {
    const diff = wrap180(elongation(jd) - target);
    jd -= diff / 12.1907;
    if (Math.abs(diff) < 1e-5) break;
  }
  return jd;
}

/** Lahiri ayanamsa (approximate), degrees. */
function ayanamsa(jd: number): number {
  const years = (jd - 2451545) / 365.25;
  return 23.853 + years * 0.013969;
}

const siderealSun = (jd: number) => norm360(sunLongitude(jd) - ayanamsa(jd));

/** Approximate local sunrise (JD, UT) at the reference location for the IST civil date. */
function sunriseJd(y: number, m: number, d: number): number {
  const n = Math.round(dateToJd(new Date(Date.UTC(y, m, d, 12))) - 2451545 + 0.0008);
  const Js = n - REF_LON / 360;
  const M = norm360(357.5291 + 0.98560028 * Js);
  const C = 1.9148 * Math.sin(M * DEG) + 0.02 * Math.sin(2 * M * DEG) + 0.0003 * Math.sin(3 * M * DEG);
  const lambda = norm360(M + C + 180 + 102.9372);
  const Jtransit = 2451545 + Js + 0.0053 * Math.sin(M * DEG) - 0.0069 * Math.sin(2 * lambda * DEG);
  const decl = Math.asin(Math.sin(lambda * DEG) * Math.sin(23.44 * DEG));
  const cosH =
    (Math.sin(-0.833 * DEG) - Math.sin(REF_LAT * DEG) * Math.sin(decl)) / (Math.cos(REF_LAT * DEG) * Math.cos(decl));
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) / DEG;
  return Jtransit - H / 360;
}

/** IST calendar date parts for a JD. */
function istParts(jd: number) {
  const d = jdToDate(jd + IST_OFFSET_DAYS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() };
}

const isoDate = (p: { y: number; m: number; d: number }) =>
  `${p.y}-${String(p.m + 1).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;

export interface Amavasya {
  /** Civil date (IST) on which the Amavasya is usually observed — YYYY-MM-DD. */
  date: string;
  weekday: number;
  /** Instant of astronomical new moon (ISO, UTC). */
  newMoon: string;
  /** Instant the Amavasya tithi begins (ISO, UTC). */
  tithiStart: string;
}

/**
 * Choose the observance day: the first civil day whose sunrise falls inside
 * the Amavasya tithi; if none (a short tithi), the day holding most of it.
 */
function observanceDay(startJd: number, endJd: number) {
  let probe = istParts(startJd);
  for (let i = 0; i < 3; i++) {
    const sr = sunriseJd(probe.y, probe.m, probe.d);
    if (sr >= startJd && sr <= endJd) return probe;
    const next = jdToDate(dateToJd(new Date(Date.UTC(probe.y, probe.m, probe.d + 1))));
    probe = { y: next.getUTCFullYear(), m: next.getUTCMonth(), d: next.getUTCDate() };
  }
  // Short tithi between two sunrises: use the civil day holding most of it.
  const s = istParts(startJd);
  const midnight = dateToJd(new Date(Date.UTC(s.y, s.m, s.d + 1))) - IST_OFFSET_DAYS;
  return midnight - startJd >= endJd - midnight ? s : istParts(endJd);
}

function buildAmavasya(newMoonJd: number): Amavasya {
  const startJd = solveElongation(348, newMoonJd - 1);
  const day = observanceDay(startJd, newMoonJd);
  const iso = isoDate(day);
  return {
    date: iso,
    weekday: new Date(`${iso}T00:00:00Z`).getUTCDay(),
    newMoon: jdToDate(newMoonJd).toISOString(),
    tithiStart: jdToDate(startJd).toISOString(),
  };
}

/** All Amavasyas whose observance day falls in `year`. */
export function amavasyasForYear(year: number): Amavasya[] {
  const out: Amavasya[] = [];
  // Start a little before the year and step by a synodic month.
  let jd = solveElongation(0, dateToJd(new Date(Date.UTC(year - 1, 11, 1))));
  const end = dateToJd(new Date(Date.UTC(year + 1, 0, 15)));
  while (jd < end) {
    const a = buildAmavasya(jd);
    if (a.date.startsWith(`${year}-`)) out.push(a);
    jd = solveElongation(0, jd + 29.53);
  }
  return out;
}

/**
 * Shani Jayanti is observed on the Amavasya that ends the lunar month
 * Vaishakha in the amanta calendar used in Maharashtra (Jyeshtha Amavasya in
 * the purnimanta calendar — the same day). That is the first new moon after
 * the Sun enters sidereal Vrishabha (Taurus).
 */
export function shaniJayanti(year: number): Amavasya {
  let jd = dateToJd(new Date(Date.UTC(year, 4, 1)));
  // Find Vrishabha sankranti (sidereal solar longitude 30°).
  for (let i = 0; i < 30; i++) {
    const diff = wrap180(siderealSun(jd) - 30);
    jd -= diff / 0.9856;
    if (Math.abs(diff) < 1e-6) break;
  }
  let nm = solveElongation(0, jd);
  if (nm < jd) nm = solveElongation(0, nm + 29.53);
  return buildAmavasya(nm);
}

export function shaniAmavasyas(year: number): Amavasya[] {
  return amavasyasForYear(year).filter((a) => a.weekday === 6);
}
