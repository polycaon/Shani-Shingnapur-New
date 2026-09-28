import { siteConfig } from "@/data/site";
import { templeInfo } from "@/data/temple";
import { getOrigin, formatRange, formatHours } from "@/data/travel";

/**
 * Resolves `{{token}}` placeholders in Markdown so shared facts live in one
 * place (src/data). Unknown tokens throw at build time, so a typo can never
 * reach production silently.
 *
 *   {{temple.district}}      → a string field of templeInfo
 *   {{distance.shirdi}}      → "about 65–75 km"
 *   {{time.pune}}            → "about 3.5–4.5 hours"
 *   {{route.nashik}}         → one-line route summary
 *   {{site.name}}
 *   {{map}} / {{directions}} → Google Maps URLs
 */
export function resolveToken(expr: string, file: string): string {
  const [ns, key] = expr.trim().split(".");
  const fail = () => {
    throw new Error(`Unknown content token "{{${expr}}}" in ${file}`);
  };
  switch (ns) {
    case "map":
      return templeInfo.mapUrl;
    case "directions":
      return templeInfo.directionsUrl;
    case "site": {
      const v = (siteConfig as Record<string, unknown>)[key];
      return typeof v === "string" ? v : fail()!;
    }
    case "temple": {
      const v = (templeInfo as Record<string, unknown>)[key];
      if (typeof v === "string") return v;
      if (v && typeof v === "object" && "value" in v) return String((v as { value: string }).value);
      return fail()!;
    }
    case "distance":
    case "time":
    case "route": {
      const o = getOrigin(key);
      if (!o) return fail()!;
      if (ns === "distance") return formatRange(o.distanceKm, "km");
      if (ns === "time") return formatHours(o.driveHours);
      return o.routeSummary;
    }
    default:
      return fail()!;
  }
}

export function applyTokens(markdown: string, file: string): string {
  return markdown.replace(/\{\{([^}]+)\}\}/g, (_, expr: string) => resolveToken(expr, file));
}
