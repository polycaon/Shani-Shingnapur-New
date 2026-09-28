import { siteConfig } from "@/data/site";

/**
 * Reserved advertising position. Renders nothing until an AdSense client ID is
 * configured, so there is no empty box or layout shift on the live site.
 * When enabled, the slot reserves its height up front to avoid CLS.
 */
export function AdSlot({ slot, className = "" }: { slot: "in-article" | "below-content" | "sidebar"; className?: string }) {
  if (!siteConfig.analytics.adsenseClient) return null;
  return (
    <aside aria-label="Advertisement" className={`no-print my-10 min-h-[280px] ${className}`}>
      <p className="mb-1 text-center text-xs uppercase tracking-wider text-ink-600">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={siteConfig.analytics.adsenseClient}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-slot-name={slot}
      />
    </aside>
  );
}
