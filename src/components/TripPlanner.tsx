"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { origins, formatRange, formatHours, getOrigin } from "@/data/travel";
import { templeInfo } from "@/data/temple";

type Duration = "half" | "one" | "two";
type Mode = "car" | "bus" | "train";

interface Stop {
  id: string;
  name: string;
  /** Position on a rough west→east axis used to order stops sensibly. */
  axis: number;
  visit: string;
  href: string;
  stayHint: string;
}

const STOPS: Record<string, Stop> = {
  trimbakeshwar: {
    id: "trimbakeshwar",
    name: "Trimbakeshwar",
    axis: 0,
    visit: "Darshan at the Trimbakeshwar Jyotirlinga temple; queues can be long on Mondays and festival days.",
    href: "/nearby-places/trimbakeshwar/",
    stayHint: "Nashik",
  },
  nashik: {
    id: "nashik",
    name: "Nashik",
    axis: 1,
    visit: "Ramkund and the Panchavati temples on the Godavari.",
    href: "/nearby-places/nashik/",
    stayHint: "Nashik",
  },
  shirdi: {
    id: "shirdi",
    name: "Shirdi",
    axis: 2,
    visit: "Darshan at Shri Saibaba Samadhi Mandir, plus Dwarkamai and Chavadi nearby.",
    href: "/nearby-places/shirdi/",
    stayHint: "Shirdi",
  },
  shingnapur: {
    id: "shingnapur",
    name: "Shani Shingnapur",
    axis: 3,
    visit: "Darshan of Shani Dev at the open-air shrine and a walk through the village. Allow 1–2 hours on weekdays, much longer on Saturdays.",
    href: "/temple/darshan/",
    stayHint: "Shani Shingnapur or Shirdi",
  },
  ahilyanagar: {
    id: "ahilyanagar",
    name: "Ahilyanagar",
    axis: 3.5,
    visit: "Ahmednagar Fort and the city's old quarter — a convenient break on the Pune side.",
    href: "/nearby-places/ahmednagar/",
    stayHint: "Ahilyanagar",
  },
  ellora: {
    id: "ellora",
    name: "Grishneshwar & Ellora",
    axis: 5,
    visit: "Grishneshwar Jyotirlinga and the Ellora Caves (the caves are closed on Tuesdays).",
    href: "/nearby-places/chhatrapati-sambhajinagar/",
    stayHint: "Chhatrapati Sambhajinagar",
  },
};

const OPTIONAL = ["shirdi", "nashik", "trimbakeshwar", "ellora", "ahilyanagar"] as const;

/** Where each starting point sits on the same axis. */
const START_AXIS: Record<string, number> = {
  shirdi: 2,
  nashik: 1,
  mumbai: -1,
  pune: 3.8,
  ahilyanagar: 3.5,
  "chhatrapati-sambhajinagar": 5.5,
};

const MODE_TIPS: Record<Mode, string> = {
  car: "A private car or taxi is the most flexible way to link several places in a day. Agree the itinerary, waiting time and total charges with the operator before you set off.",
  bus: "MSRTC buses and shared jeeps link these towns, but connections take time. Plan fewer stops per day and keep the last bus times in mind — confirm them locally.",
  train: "Trains get you to Ahilyanagar, Shirdi, Nashik Road or Chhatrapati Sambhajinagar. Every temple visit still needs a road connection from the station.",
};

export function TripPlanner() {
  const [start, setStart] = useState("shirdi");
  const [duration, setDuration] = useState<Duration>("one");
  const [mode, setMode] = useState<Mode>("car");
  const [extras, setExtras] = useState<string[]>(["shirdi"]);

  const toggle = (id: string) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  const plan = useMemo(() => {
    const origin = getOrigin(start)!;
    const warnings: string[] = [];
    let chosen = extras.filter((x) => x !== start);
    const nearby = start === "shirdi" || start === "ahilyanagar";

    if (duration === "half") {
      if (!nearby) warnings.push(`A half-day visit is only realistic from Shirdi or Ahilyanagar. From ${origin.name} allow at least a full day.`);
      if (chosen.length) warnings.push("With only half a day, we have left out the extra places you picked.");
      chosen = [];
    }

    // Mumbai travellers without western stops usually go via Pune/Ahilyanagar.
    const viaPune = start === "mumbai" && !chosen.some((c) => ["nashik", "trimbakeshwar", "shirdi"].includes(c));
    let pos = viaPune ? START_AXIS.pune : (START_AXIS[start] ?? 3);
    // Greedy nearest-neighbour ordering along a rough west→east axis.
    const pending = [...chosen.map((c) => STOPS[c]), STOPS.shingnapur];
    const stops: Stop[] = [];
    while (pending.length) {
      pending.sort((a, b) => Math.abs(a.axis - pos) - Math.abs(b.axis - pos));
      const next = pending.shift()!;
      stops.push(next);
      pos = next.axis;
    }

    const days = duration === "two" ? 2 : 1;
    const perDay = Math.ceil(stops.length / days);
    const dayPlans = Array.from({ length: days }, (_, d) => stops.slice(d * perDay, (d + 1) * perDay)).filter((d) => d.length);

    if (duration === "one" && stops.length > 2 && !(stops.length === 3 && nearby))
      warnings.push("That is a lot for one day. Consider the two-day option or dropping a stop.");
    if (duration === "two" && stops.length > 5) warnings.push("Five or more stops in two days means long hours on the road.");
    if (start === "mumbai" && duration !== "two") warnings.push("From Mumbai the drive alone is about 6–8 hours each way; a two-day plan is far more comfortable.");
    if (mode !== "car" && stops.length > 2) warnings.push("Linking several places by public transport is slow — fewer stops per day will be more realistic.");
    if (chosen.includes("ellora")) warnings.push("The Ellora Caves are closed on Tuesdays.");

    return { origin, dayPlans, warnings };
  }, [start, duration, mode, extras]);

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      <form className="card space-y-6 p-5" onSubmit={(e) => e.preventDefault()} aria-label="Trip preferences">
        <div>
          <label htmlFor="tp-start" className="block font-semibold">
            Starting location
          </label>
          <select
            id="tp-start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-2 min-h-[44px] w-full rounded-lg border border-sand-300 bg-white px-3"
          >
            {origins.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
                {o.aka ? ` (${o.aka})` : ""}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="font-semibold">Time available</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ["half", "Half day"],
                ["one", "One day"],
                ["two", "Two days"],
              ] as const
            ).map(([v, l]) => (
              <label key={v} className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron-600 ${duration === v ? "border-saffron-700 bg-saffron-700 text-white" : "border-sand-300 bg-white"}`}>
                <input type="radio" name="duration" className="sr-only" checked={duration === v} onChange={() => setDuration(v)} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">Travel preference</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ["car", "Car / taxi"],
                ["bus", "Bus"],
                ["train", "Train + road"],
              ] as const
            ).map(([v, l]) => (
              <label key={v} className={`flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border text-center text-sm font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-saffron-600 ${mode === v ? "border-saffron-700 bg-saffron-700 text-white" : "border-sand-300 bg-white"}`}>
                <input type="radio" name="mode" className="sr-only" checked={mode === v} onChange={() => setMode(v)} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold">Also visit</legend>
          <div className="mt-2 space-y-1">
            {OPTIONAL.filter((id) => id !== start).map((id) => (
              <label key={id} className="flex min-h-[40px] cursor-pointer items-center gap-3">
                <input type="checkbox" checked={extras.includes(id)} onChange={() => toggle(id)} className="h-5 w-5 accent-saffron-700" />
                {STOPS[id].name}
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <section aria-live="polite" aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="text-2xl sm:text-3xl">
          Your suggested plan
        </h2>
        <p className="mt-2 text-ink-700">
          From {plan.origin.name}, Shani Shingnapur is {formatRange(plan.origin.distanceKm, "km")} by road (
          {formatHours(plan.origin.driveHours)} of driving).
        </p>

        {plan.warnings.length > 0 && (
          <ul className="callout callout-warning mt-4 list-disc space-y-1 pl-8">
            {plan.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        <ol className="mt-6 space-y-6">
          {plan.dayPlans.map((day, d) => (
            <li key={d} className="card p-5">
              <h3 className="font-display text-xl">{plan.dayPlans.length > 1 ? `Day ${d + 1}` : "The day"}</h3>
              <ol className="mt-3 space-y-4 border-l-2 border-sand-200 pl-5">
                <li className="relative">
                  <span className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-night-700" aria-hidden="true" />
                  <p className="font-semibold">{d === 0 ? `Set out from ${plan.origin.name}` : `Leave ${plan.dayPlans[d - 1].at(-1)!.stayHint}`}</p>
                  <p className="text-sm text-ink-600">
                    {d === 0 ? "An early start (around sunrise) helps you beat heat and queues." : "Start early again to keep the day relaxed."}
                  </p>
                </li>
                {day.map((s) => (
                  <li key={s.id} className="relative">
                    <span className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-saffron-600" aria-hidden="true" />
                    <p className="font-semibold">
                      <Link href={s.href} className="underline underline-offset-2">
                        {s.name}
                      </Link>
                    </p>
                    <p className="text-[0.95rem] text-ink-700">{s.visit}</p>
                  </li>
                ))}
                <li className="relative">
                  <span className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-night-700" aria-hidden="true" />
                  <p className="font-semibold">
                    {d < plan.dayPlans.length - 1 ? `Overnight: ${day.at(-1)!.stayHint}` : `Return to ${plan.origin.name} or continue your journey`}
                  </p>
                </li>
              </ol>
            </li>
          ))}
        </ol>

        <div className="mt-6 space-y-3 text-[0.95rem]">
          <p>
            <strong>Getting around:</strong> {MODE_TIPS[mode]}
          </p>
          <p>
            <a href={templeInfo.directionsUrl} target="_blank" rel="noopener" className="font-semibold underline">
              Open directions to the temple in Google Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <p className="text-sm text-ink-600">
            This plan is generated from the approximate information on this website. Travel times are not guaranteed and
            temple arrangements can change — check current conditions before you travel.
          </p>
        </div>
      </section>
    </div>
  );
}
