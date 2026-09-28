import Link from "next/link";
import { festivals } from "@/data/festivals";

export function FestivalList() {
  return (
    <ul className="not-prose grid gap-4 md:grid-cols-3" role="list">
      {festivals.map((f) => (
        <li key={f.id} className="card flex flex-col p-5">
          <h3 className="text-lg font-semibold text-ink-900">
            <Link href={f.page} className="text-ink-900 no-underline hover:text-saffron-700">
              {f.name}
            </Link>
          </h3>
          <p className="mt-2 text-[0.95rem] text-ink-700">{f.summary}</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div>
              <dt className="inline font-semibold">When: </dt>
              <dd className="inline text-ink-700">{f.when}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Crowds: </dt>
              <dd className="inline text-ink-700">{f.crowd}</dd>
            </div>
          </dl>
          <Link href={f.page} className="mt-auto pt-4 text-sm font-semibold">
            About {f.name} <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
