import Link from "next/link";
import { templeInfo, timings, visitorGuidance, type Verification } from "@/data/temple";
import { VerificationBadge } from "./VerificationBadge";
import { formatDate } from "./ArticleMeta";

/** QuickInfoCard — scannable temple facts. */
export function QuickInfoCard({ compact = false }: { compact?: boolean }) {
  const rows: [string, React.ReactNode][] = [
    ["Temple", `${templeInfo.name} (${templeInfo.formalName.split(",")[0]})`],
    ["Location", `${templeInfo.village}, near ${templeInfo.nearbyTown}`],
    ["Taluka", templeInfo.taluka],
    ["District", `${templeInfo.district} (formerly ${templeInfo.districtFormerName})`],
    ["State", `${templeInfo.state}, India`],
    ["Deity", templeInfo.deity],
    ["Temple type", templeInfo.templeType],
    ["Important day", templeInfo.worshipDay],
    ["Major festival", <Link key="sj" href="/festivals/shani-jayanti/">{templeInfo.majorFestival}</Link>],
    ["Managed by", templeInfo.trust.value],
    [
      "Nearby pilgrimage",
      <span key="np">
        <Link href="/nearby-places/shirdi/">Shirdi</Link>, <Link href="/nearby-places/nashik/">Nashik</Link>,{" "}
        <Link href="/nearby-places/trimbakeshwar/">Trimbakeshwar</Link>,{" "}
        <Link href="/nearby-places/chhatrapati-sambhajinagar/">Grishneshwar &amp; Ellora</Link>
      </span>,
    ],
  ];
  const shown = compact ? rows.slice(0, 8) : rows;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 bg-night-800 px-5 py-3 text-white">
        <h2 className="font-display text-lg text-white">Quick information</h2>
        <span className="text-xs text-gold-300">Shani Shingnapur at a glance</span>
      </div>
      <dl className="divide-y divide-sand-100 text-[0.95rem]">
        {shown.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-5 py-2.5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-semibold text-ink-700">{k}</dt>
            <dd className="text-ink-900 [&_a]:underline [&_a]:underline-offset-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function StatusTable({ caption, rows }: { caption: string; rows: { label: string; value: string; status: Verification }[] }) {
  return (
    <div className="table-wrap" role="region" tabIndex={0} aria-label={caption}>
      <table>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">What we know</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.value}</td>
              <td>
                <VerificationBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** TimingCard — the single source for timings shown anywhere on the site. */
export function TimingsTable() {
  return (
    <div className="not-prose space-y-3">
      <StatusTable caption="Shani Shingnapur temple timings" rows={timings.rows} />
      <p className="text-sm text-ink-600">
        Timings information last checked {formatDate(timings.lastChecked)}. {timings.summary}
      </p>
    </div>
  );
}

export function VisitorGuidanceTable() {
  const g = visitorGuidance;
  return (
    <StatusTable
      caption="Visitor guidance"
      rows={[
        { label: "Dress code", ...g.dressCode },
        { label: "Photography", ...g.photography },
        { label: "Access to the platform", ...g.platformAccess },
        { label: "Parking", ...g.parking },
        { label: "Fees", ...g.fees },
      ]}
    />
  );
}

export function TrustLink() {
  return (
    <div className="callout callout-info not-prose">
      <p className="font-semibold text-ink-900">Confirm with the temple trust</p>
      <p className="mt-1">
        For current timings, pooja bookings and accommodation run by the trust, use the website published by{" "}
        {templeInfo.trust.value}:{" "}
        <a href={templeInfo.officialWebsite.value} target="_blank" rel="noopener" className="font-semibold underline">
          shanidev.com<span className="sr-only"> (opens in a new tab)</span>
        </a>
        . We are an independent guide and are not affiliated with the trust.
      </p>
    </div>
  );
}
