import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-night-900 pb-24 text-sand-200 lg:pb-0">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-white no-underline">
              <LogoMark />
              <span className="font-display text-lg">Shani Shingnapur Temple</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-sand-300">{siteConfig.tagline}.</p>
            <p className="mt-4 rounded-lg border border-night-700 p-3 text-sm leading-relaxed text-sand-200">
              <strong className="text-white">Independent website.</strong> {siteConfig.independentNotice.replace("ShaniShingnapurTemple.com is an independent informational website. ", "")}
            </p>
          </div>
          {footerNav.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-gold-300">{col.heading}</h2>
              <ul className="mt-3 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-[36px] items-center text-sm text-sand-200 no-underline hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-night-700 pt-6 text-xs text-sand-300 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ShaniShingnapurTemple.com. Original text; please link rather than copy.</p>
          <p>{siteConfig.templeDisclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
