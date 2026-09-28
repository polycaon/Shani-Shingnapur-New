import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // All public URLs end in a slash: /temple/history/
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/search-index.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
  async redirects() {
    return [
      // Canonical host: https://shanishingnapurtemple.com (no www). HTTP→HTTPS is
      // enforced by the host (Vercel does this automatically for custom domains).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.shanishingnapurtemple.com" }],
        destination: "https://shanishingnapurtemple.com/:path*/",
        permanent: true,
      },
      // Legacy URL seen indexed from the previous version of the site.
      { source: "/visitor-info", destination: "/temple/timings/", permanent: true },
      // Common alternative paths people type or link to.
      { source: "/timings", destination: "/temple/timings/", permanent: true },
      { source: "/history", destination: "/temple/history/", permanent: true },
      { source: "/how-to-reach", destination: "/travel/how-to-reach/", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms/", permanent: true },
      { source: "/about-us", destination: "/about/", permanent: true },
      { source: "/contact-us", destination: "/contact/", permanent: true },
    ];
  },
};

export default nextConfig;
