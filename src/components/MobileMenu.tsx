"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, quickLinks } from "@/data/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close when navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input,a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 hover:bg-sand-100"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
          {open ? (
            <path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z" />
          ) : (
            <path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          )}
        </svg>
      </button>
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-sand-200 bg-sand-50 px-4 pb-24 pt-4"
        >
          <form action="/search/" role="search" className="flex gap-2">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search guides"
              className="min-h-[48px] w-full rounded-xl border border-sand-300 bg-white px-4 text-base"
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
          <p className="eyebrow mt-6">Quick links</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="card flex min-h-[48px] items-center px-3 text-sm font-semibold text-ink-900 no-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <nav aria-label="Main" className="mt-6">
            <ul className="divide-y divide-sand-200">
              {mainNav.map((item) => (
                <li key={item.href} className="py-1">
                  <Link href={item.href} className="flex min-h-[48px] items-center text-lg font-semibold text-ink-900 no-underline">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-2 grid grid-cols-2 gap-x-3">
                      {item.children
                        .filter((c) => c.href !== item.href)
                        .map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="flex min-h-[44px] items-center text-ink-700 no-underline">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="py-1">
                <Link href="/shani-dev/" className="flex min-h-[48px] items-center text-lg font-semibold text-ink-900 no-underline">
                  Shani Dev
                </Link>
              </li>
              <li className="py-1">
                <Link href="/pilgrimage/" className="flex min-h-[48px] items-center text-lg font-semibold text-ink-900 no-underline">
                  Pilgrimage
                </Link>
              </li>
              <li className="py-1">
                <Link href="/about/" className="flex min-h-[48px] items-center text-lg font-semibold text-ink-900 no-underline">
                  About
                </Link>
              </li>
              <li className="py-1">
                <Link href="/contact/" className="flex min-h-[48px] items-center text-lg font-semibold text-ink-900 no-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
