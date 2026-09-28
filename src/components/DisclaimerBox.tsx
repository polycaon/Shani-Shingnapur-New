import { siteConfig } from "@/data/site";
import type { Disclaimer } from "@/lib/content";

export function DisclaimerBox({ kind }: { kind: Disclaimer }) {
  const lines =
    kind === "both"
      ? [siteConfig.templeDisclaimer, siteConfig.travelDisclaimer]
      : [kind === "temple" ? siteConfig.templeDisclaimer : siteConfig.travelDisclaimer];
  return (
    <aside className="callout callout-warning flex gap-3" aria-label="Please note">
      <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true">
        <path fill="currentColor" d="M10 1.8 19 17.5H1L10 1.8Zm0 5.2c-.5 0-.9.4-.9.9l.2 4.6c0 .4.3.7.7.7s.7-.3.7-.7l.2-4.6c0-.5-.4-.9-.9-.9Zm0 8.8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      <div className="space-y-1">
        {lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </aside>
  );
}
