import Link from "next/link";
import { origins, railwayStations, airports, getOrigin, formatRange, formatHours } from "@/data/travel";
import { siteConfig } from "@/data/site";
import { VerificationBadge } from "./VerificationBadge";

/** Comparison table of every origin city. */
export function DistanceTable() {
  return (
    <div className="not-prose space-y-2">
      <div className="table-wrap" role="region" tabIndex={0} aria-label="Distances to Shani Shingnapur">
        <table>
          <caption className="sr-only">Approximate road distances and drive times to Shani Shingnapur</caption>
          <thead>
            <tr>
              <th scope="col">Starting point</th>
              <th scope="col">Approx. road distance</th>
              <th scope="col">Typical drive</th>
              <th scope="col">Route overview</th>
            </tr>
          </thead>
          <tbody>
            {origins.map((o) => (
              <tr key={o.id}>
                <th scope="row">
                  <Link href={o.distancePage} className="underline underline-offset-2">
                    {o.name}
                  </Link>
                  {o.aka && <span className="block text-xs font-normal text-ink-600">({o.aka})</span>}
                </th>
                <td>{formatRange(o.distanceKm, "km")}</td>
                <td>{formatHours(o.driveHours)}</td>
                <td>{o.routeSummary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-ink-600">{siteConfig.travelDisclaimer}</p>
    </div>
  );
}

/** DistanceCard — key facts for one origin. */
export function DistanceCard({ id }: { id: string }) {
  const o = getOrigin(id);
  if (!o) throw new Error(`Unknown origin ${id}`);
  const facts: [string, React.ReactNode][] = [
    ["Road distance", <>{formatRange(o.distanceKm, "km")} <VerificationBadge status={o.status} /></>],
    ["Typical drive time", formatHours(o.driveHours)],
    ["Usual route", o.routeSummary],
    ["By train", o.rail],
    ["By air", o.air],
    ["By bus", o.bus],
  ];
  return (
    <div className="not-prose card overflow-hidden">
      <div className="bg-night-800 px-5 py-3">
        <p className="font-display text-lg text-white">
          {o.name} → Shani Shingnapur
        </p>
      </div>
      <dl className="divide-y divide-sand-100 text-[0.95rem]">
        {facts.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[10rem_1fr] sm:gap-3">
            <dt className="font-semibold text-ink-700">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-sand-100 bg-sand-50 px-5 py-3 text-sm text-ink-600">{siteConfig.travelDisclaimer}</p>
    </div>
  );
}

export function RouteOptions({ id }: { id: string }) {
  const o = getOrigin(id);
  if (!o) throw new Error(`Unknown origin ${id}`);
  return (
    <ol className="not-prose space-y-3">
      {o.routeOptions.map((r, i) => (
        <li key={r} className="card flex gap-3 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-sm font-bold text-saffron-800">
            {i + 1}
          </span>
          <span>{r}</span>
        </li>
      ))}
    </ol>
  );
}

function SimpleTable({ label, rows }: { label: string; rows: { name: string; distanceKm: string; note: string }[] }) {
  return (
    <div className="not-prose table-wrap" role="region" tabIndex={0} aria-label={label}>
      <table>
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <th scope="col">{label.includes("air") ? "Airport" : "Station"}</th>
            <th scope="col">Approx. distance to temple</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <th scope="row">{r.name}</th>
              <td>{r.distanceKm}</td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const StationsTable = () => <SimpleTable label="Nearest railway stations" rows={railwayStations} />;
export const AirportsTable = () => <SimpleTable label="Nearest airports" rows={airports} />;
