import Link from "next/link";
import { templeInfo } from "@/data/temple";

const items = [
  { label: "Temple", href: "/temple/", icon: "M12 3 3 9h18l-9-6Zm-7 8v8h3v-6h8v6h3v-8H5Z" },
  { label: "Timings", href: "/temple/timings/", icon: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l5 3 1-1.7-4-2.3V7Z" },
  { label: "Directions", href: templeInfo.directionsUrl, external: true, icon: "M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" },
  { label: "Plan visit", href: "/plan-your-visit/", icon: "M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 8h14v10H5V10Z" },
];

/** Compact bottom bar on small screens for the four most-needed actions. */
export function MobileActionBar() {
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((i) => {
          const inner = (
            <>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="currentColor" d={i.icon} />
              </svg>
              <span>{i.label}</span>
              {i.external && <span className="sr-only"> (opens Google Maps)</span>}
            </>
          );
          const cls = "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[0.72rem] font-semibold text-ink-800 no-underline hover:text-saffron-700";
          return (
            <li key={i.label}>
              {i.external ? (
                <a href={i.href} target="_blank" rel="noopener" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link href={i.href} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
