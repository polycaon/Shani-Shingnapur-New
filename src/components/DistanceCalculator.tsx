"use client";

import { useState } from "react";
import Link from "next/link";
import { origins, formatRange, formatHours } from "@/data/travel";

export function DistanceCalculator() {
  const [id, setId] = useState(origins[0].id);
  const o = origins.find((x) => x.id === id)!;
  return (
    <div className="not-prose card p-5 sm:p-6">
      <h2 className="font-display text-2xl">Shani Shingnapur distance calculator</h2>
      <p className="mt-1 text-sm text-ink-600">Choose where you are starting from to see approximate road distance and travel options.</p>
      <fieldset className="mt-4">
        <legend className="mb-2 font-semibold">Starting from</legend>
        <div className="flex flex-wrap gap-2">
          {origins.map((x) => (
            <label
              key={x.id}
              className={`flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron-600 ${
                x.id === id ? "border-saffron-700 bg-saffron-700 text-white" : "border-sand-300 bg-white text-ink-800 hover:border-saffron-500"
              }`}
            >
              <input type="radio" name="origin" value={x.id} checked={x.id === id} onChange={() => setId(x.id)} className="sr-only" />
              {x.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-night-800 p-4 text-white">
          <p className="text-sm text-gold-300">Approx. road distance</p>
          <p className="mt-1 font-display text-3xl">{formatRange(o.distanceKm, "km")}</p>
        </div>
        <div className="rounded-xl bg-sand-100 p-4">
          <p className="text-sm text-ink-600">Typical drive time</p>
          <p className="mt-1 font-display text-3xl text-ink-900">{formatHours(o.driveHours)}</p>
        </div>
        <div className="sm:col-span-2 space-y-2 text-[0.95rem]">
          <p>
            <strong>Route:</strong> {o.routeSummary}
          </p>
          <p>
            <strong>Train:</strong> {o.rail}
          </p>
          <p>
            <strong>Bus:</strong> {o.bus}
          </p>
          <p>
            <Link href={o.distancePage} className="font-semibold underline">
              Full {o.name} to Shani Shingnapur guide →
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-600">
        Actual distance and travel time vary with the route, traffic, weather and road works. Check a live map before you set out.
      </p>
    </div>
  );
}
