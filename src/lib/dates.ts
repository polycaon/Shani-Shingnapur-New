const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "28 September 2026" (or "Monday, 28 September 2026") from an ISO date — identical on server and client. */
export function formatIsoDate(iso: string, withWeekday = false): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const base = `${d} ${MONTHS[m - 1]} ${y}`;
  if (!withWeekday) return base;
  return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${base}`;
}
