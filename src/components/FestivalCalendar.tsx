"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { amavasyasForYear, shaniJayanti } from "@/lib/astro";
import { festivalDateOverrides } from "@/data/festivals";
import { VerificationBadge } from "./VerificationBadge";
import { formatIsoDate } from "@/lib/dates";

const fmt = (iso: string) => formatIsoDate(iso, true);

export function FestivalCalendar({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    // Only known after hydration, so "upcoming" markers never mismatch server HTML.
    const id = requestAnimationFrame(() => setToday(new Date().toISOString().slice(0, 10)));
    return () => cancelAnimationFrame(id);
  }, []);

  const data = useMemo(() => {
    const override = festivalDateOverrides[year]?.shaniJayanti;
    const sj = shaniJayanti(year);
    const all = amavasyasForYear(year);
    return {
      jayanti: override ? { date: override.date, status: override.status } : { date: sj.date, status: "approximate" as const },
      all,
      shaniAmavasya: all.filter((a) => a.weekday === 6),
    };
  }, [year]);

  const years = [initialYear - 1, initialYear, initialYear + 1, initialYear + 2];
  const nextSat = data.shaniAmavasya.find((a) => today && a.date >= today);

  return (
    <div className="not-prose space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="cal-year" className="font-semibold">
          Show year
        </label>
        <select
          id="cal-year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="min-h-[44px] rounded-lg border border-sand-300 bg-white px-3"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <p className="eyebrow">Shani Jayanti {year}</p>
          <p className="mt-2 text-xl font-semibold">{fmt(data.jayanti.date)}</p>
          <p className="mt-2 text-sm text-ink-700">
            Vaishakha Amavasya (amanta calendar) — the appearance day of Shani Dev.{" "}
            <Link href="/festivals/shani-jayanti/">About Shani Jayanti</Link>
          </p>
          <p className="mt-3">
            <VerificationBadge status={data.jayanti.status} />{" "}
            <span className="text-xs text-ink-600">{data.jayanti.status === "approximate" ? "Calculated — confirm with a panchang" : "Confirmed"}</span>
          </p>
        </div>
        <div className="card p-5">
          <p className="eyebrow">Shani Amavasya {year}</p>
          {data.shaniAmavasya.length ? (
            <ul className="mt-2 space-y-1">
              {data.shaniAmavasya.map((a) => (
                <li key={a.date} className="text-lg font-semibold">
                  {fmt(a.date)}
                  {nextSat?.date === a.date && (
                    <span className="badge badge-sourced ml-2 align-middle">Next</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-ink-700">By our calculation no Amavasya falls on a Saturday in {year}.</p>
          )}
          <p className="mt-2 text-sm text-ink-700">
            An Amavasya that falls on a Saturday. <Link href="/festivals/shani-amavasya/">About Shani Amavasya</Link>
          </p>
          <p className="mt-3">
            <VerificationBadge status="approximate" /> <span className="text-xs text-ink-600">Calculated — confirm with a panchang</span>
          </p>
        </div>
      </div>

      <div className="table-wrap" role="region" tabIndex={0} aria-label={`All Amavasya dates in ${year}`}>
        <table>
          <caption className="sr-only">Calculated Amavasya (new moon) observance dates in {year}</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Amavasya (observance day, IST)</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {data.all.map((a, i) => {
              const tags = [
                a.weekday === 6 ? "Shani Amavasya (Saturday)" : "",
                a.date === data.jayanti.date ? "Shani Jayanti" : "",
              ].filter(Boolean);
              return (
                <tr key={a.date} className={tags.length ? "bg-saffron-50" : undefined}>
                  <th scope="row">{i + 1}</th>
                  <td>
                    {fmt(a.date)}
                    {today && a.date < today && <span className="ml-2 text-xs text-ink-600">(past)</span>}
                  </td>
                  <td>{tags.join(" · ") || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
