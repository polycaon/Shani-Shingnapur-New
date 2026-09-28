import Link from "next/link";
import { mainNav } from "@/data/navigation";
import { LogoMark } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/95 backdrop-blur supports-[backdrop-filter]:bg-sand-50/85">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink-900 no-underline" aria-label="Shani Shingnapur Temple guide — home">
          <LogoMark className="h-9 w-9 shrink-0" />
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-display text-[1.05rem] text-ink-900 sm:text-[1.15rem]">Shani Shingnapur Temple</span>
            <span className="hidden whitespace-nowrap text-[0.66rem] font-medium uppercase tracking-[0.14em] text-gold-700 sm:block lg:hidden xl:block">
              Independent pilgrim guide
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-2 text-[0.92rem] font-medium xl:px-2.5 text-ink-800 no-underline hover:bg-sand-100 hover:text-saffron-800"
                >
                  {item.label}
                  {item.children && (
                    <svg viewBox="0 0 20 20" className="ml-0.5 h-4 w-4 text-ink-600" aria-hidden="true">
                      <path fill="currentColor" d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                    </svg>
                  )}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full z-50 w-60 translate-y-1 rounded-xl border border-sand-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-lg px-3 py-2 text-sm text-ink-800 no-underline hover:bg-sand-100 hover:text-saffron-800">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/search/" className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-800 hover:bg-sand-100" aria-label="Search">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="currentColor" d="M10 3a7 7 0 0 1 5.6 11.2l4.6 4.6-1.4 1.4-4.6-4.6A7 7 0 1 1 10 3Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
            </svg>
          </Link>
          <Link href="/plan-your-visit/" className="btn btn-primary hidden whitespace-nowrap sm:inline-flex lg:px-3 xl:px-4">
            Plan Your Visit
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
