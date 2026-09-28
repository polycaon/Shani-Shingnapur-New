"use client";

import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
  ];

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2" aria-label="Share this page">
      <span className="text-sm font-semibold text-ink-700">Share:</span>
      <button type="button" onClick={share} className="btn btn-outline min-h-[40px] px-3 py-1.5 text-sm">
        {copied ? "Link copied" : "Share / copy link"}
      </button>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener" className="btn btn-outline min-h-[40px] px-3 py-1.5 text-sm">
          {l.name}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
