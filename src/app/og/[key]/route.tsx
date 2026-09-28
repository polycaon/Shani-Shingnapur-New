import { ImageResponse } from "next/og";
import { getAllEntries } from "@/lib/content";
import { staticRoutes } from "@/lib/routes";

export const dynamicParams = false;

const keyFor = (url: string) => (url === "/" ? "home" : url.split("/").filter(Boolean).join("--"));

function lookup(key: string) {
  const s = staticRoutes.find((r) => keyFor(r.url) === key);
  if (s) return { title: s.url === "/" ? "Shani Shingnapur Temple" : s.shortTitle, subtitle: s.description, section: "Guide" };
  const e = getAllEntries().find((x) => keyFor(x.url) === key);
  if (e) {
    const section = e.slug[0]?.replace(/-/g, " ") ?? "Guide";
    return { title: e.meta.title, subtitle: e.meta.description, section };
  }
  return null;
}

export function generateStaticParams() {
  return [...staticRoutes.map((r) => r.url), ...getAllEntries().map((e) => e.url)].map((u) => ({ key: `${keyFor(u)}.png` }));
}

export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const data = lookup(key.replace(/\.png$/, ""));
  if (!data) return new Response("Not found", { status: 404 });
  const title = data.title.length > 90 ? `${data.title.slice(0, 87)}…` : data.title;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #121829 0%, #1b2338 55%, #2a3452 100%)",
          color: "#fcf9f3",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="23" fill="#0b0f1a" stroke="#e6c77a" strokeWidth="1" />
            <ellipse cx="24" cy="15" rx="11" ry="3.2" fill="none" stroke="#e6c77a" strokeWidth="1.6" />
            <circle cx="24" cy="15" r="4.2" fill="#e6c77a" />
            <path d="M19.5 37V24.5c0-2.6 2-4.5 4.5-4.5s4.5 1.9 4.5 4.5V37z" fill="#000" stroke="#e07a1f" strokeWidth="1.2" />
            <rect x="12" y="37" width="24" height="3.2" rx="1" fill="#e07a1f" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, color: "#e6c77a" }}>ShaniShingnapurTemple.com</div>
            <div style={{ fontSize: 22, color: "#dccaa6", textTransform: "uppercase", letterSpacing: 3 }}>{data.section}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: title.length > 55 ? 58 : 70, lineHeight: 1.1, color: "#ffffff" }}>{title}</div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#dccaa6", maxWidth: 1000 }}>
            {data.subtitle.length > 150 ? `${data.subtitle.slice(0, 147)}…` : data.subtitle}
          </div>
        </div>
        <div style={{ display: "flex", height: 8, width: "100%", background: "linear-gradient(90deg, #e07a1f, #e6c77a)", borderRadius: 4 }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
