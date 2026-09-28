#!/usr/bin/env node
/**
 * Automated SEO & link validation against a production build.
 *
 *   npm run build && npm run validate
 *
 * Starts `next start` on a free port, crawls every URL in the sitemap plus
 * every internal link discovered, and checks for:
 *   missing/duplicate titles & descriptions, missing/multiple H1s, missing or
 *   wrong canonicals, accidental noindex, broken internal links, images
 *   without alt text, invalid JSON-LD, pages missing from the sitemap,
 *   noindexed pages inside the sitemap, and redirect rules.
 * Exits non-zero on errors.
 */
import { spawn } from "node:child_process";
import net from "node:net";
import http from "node:http";

const SITE = "https://shanishingnapurtemple.com";
const errors = [];
const warnings = [];
const err = (url, msg) => errors.push(`${url}  →  ${msg}`);
const warn = (url, msg) => warnings.push(`${url}  →  ${msg}`);

const freePort = () =>
  new Promise((res) => {
    const s = net.createServer().listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });

// Reuse a running server with BASE_URL=http://localhost:3000, or start one.
let BASE = process.env.BASE_URL;
let server = null;
if (!BASE) {
  const port = await freePort();
  BASE = `http://localhost:${port}`;
  server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { stdio: "ignore" });
}
const DEBUG = !!process.env.DEBUG;

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/robots.txt`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Server did not start");
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

function toPath(href) {
  if (!href) return null;
  if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  return href.split("#")[0].split("?")[0] || "/";
}

try {
  await waitForServer();

  // --- robots.txt ---
  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) err("/robots.txt", "missing sitemap reference");
  if (/Disallow:\s*\/\s*$/m.test(robots)) err("/robots.txt", "disallows the whole site");
  for (const p of ["/_next/", "/og/", "/icon"]) if (robots.includes(`Disallow: ${p}`)) err("/robots.txt", `blocks ${p}`);

  // --- sitemap ---
  const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapPaths = new Set(sitemapUrls.map((u) => u.replace(SITE, "") || "/"));
  if (sitemapUrls.length < 50) err("/sitemap.xml", `only ${sitemapUrls.length} URLs`);
  for (const u of sitemapUrls) if (!u.startsWith(`${SITE}/`) || !u.endsWith("/")) err("/sitemap.xml", `non-canonical URL ${u}`);

  // --- crawl ---
  const queue = [...sitemapPaths, "/search/", "/gallery/"];
  const seen = new Set();
  const titles = new Map();
  const descs = new Map();
  const indexable = new Set();
  const linkSources = new Map();

  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    if (DEBUG) console.log("crawl", path);
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      warn(path, `redirects to ${res.headers.get("location")} (link to the final URL instead)`);
      continue;
    }
    if (res.status !== 200) {
      err(path, `HTTP ${res.status}${linkSources.has(path) ? ` (linked from ${[...linkSources.get(path)].slice(0, 3).join(", ")})` : ""}`);
      continue;
    }
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) continue;
    const html = await res.text();
    const head = html.split("</head>")[0];

    const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
    const desc = decode(attr(head.match(/<meta name="description"[^>]*>/)?.[0] ?? "", "content") ?? "");
    const canonical = attr(head.match(/<link rel="canonical"[^>]*>/)?.[0] ?? "", "href");
    const robotsMeta = attr(head.match(/<meta name="robots"[^>]*>/)?.[0] ?? "", "content") ?? "";
    const noindex = robotsMeta.includes("noindex");
    const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

    if (!title) err(path, "missing <title>");
    else if (title.length > 70) warn(path, `title is ${title.length} chars: "${title}"`);
    if (!desc) err(path, "missing meta description");
    else if (desc.length < 70 || desc.length > 165) warn(path, `description is ${desc.length} chars`);
    if (h1s !== 1) err(path, `${h1s} <h1> elements`);
    if (!head.includes('property="og:title"')) err(path, "missing og:title");
    if (!head.includes('property="og:image"')) err(path, "missing og:image");
    if (!head.includes('name="twitter:card"')) err(path, "missing twitter:card");

    if (!noindex) {
      indexable.add(path);
      if (canonical !== `${SITE}${path}`) err(path, `canonical is ${canonical}`);
      if (titles.has(title)) err(path, `duplicate title with ${titles.get(title)}`);
      else titles.set(title, path);
      if (descs.has(desc)) err(path, `duplicate description with ${descs.get(desc)}`);
      else descs.set(desc, path);
      if (!sitemapPaths.has(path)) err(path, "indexable page missing from sitemap");
    } else if (sitemapPaths.has(path)) err(path, "noindex page is listed in the sitemap");

    // Images need alt text (empty alt only allowed for decorative images marked aria-hidden).
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\balt="/.test(img)) err(path, `image without alt: ${img.slice(0, 80)}`);
    }

    // Structured data must parse.
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const data = JSON.parse(m[1]);
        const items = data["@graph"] ?? [data];
        for (const it of items) if (!it["@type"]) err(path, "JSON-LD item without @type");
      } catch (e) {
        err(path, `invalid JSON-LD: ${e.message}`);
      }
    }

    // Placeholder / empty links.
    if (/href="#"/.test(html)) err(path, 'placeholder href="#"');
    if (/\bTODO\b|lorem ipsum|\{\{[a-z]/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) err(path, "placeholder text or unresolved token");

    for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const p = toPath(decode(m[1]));
      if (!p) continue;
      if (!p.endsWith("/") && !/\.[a-z]+$/.test(p)) err(path, `internal link without trailing slash: ${p}`);
      if (!linkSources.has(p)) linkSources.set(p, new Set());
      linkSources.get(p).add(path);
      if (!seen.has(p)) queue.push(p);
    }
  }

  // Orphans: sitemap pages that nothing links to.
  for (const p of sitemapPaths) if (p !== "/" && !linkSources.has(p)) warn(p, "no internal links point to this page");

  // --- redirects (follow chains; every hop must be permanent) ---
  async function finalRedirect(from, max = 3) {
    let url = `${BASE}${from}`;
    for (let i = 0; i < max; i++) {
      const r = await fetch(url, { redirect: "manual" });
      if (![301, 308].includes(r.status)) return { status: r.status, url };
      url = new URL(r.headers.get("location"), url).toString();
    }
    return { status: 0, url };
  }
  for (const [from, to] of [
    ["/visitor-info", "/temple/timings/"],
    ["/timings", "/temple/timings/"],
    ["/temple/history", "/temple/history/"],
  ]) {
    const r = await finalRedirect(from);
    if (r.status !== 200 || !r.url.endsWith(to)) err(from, `expected permanent redirect(s) to ${to}, ended at ${r.status} ${r.url}`);
  }
  // fetch() cannot override Host, so use node:http for the www check.
  const wwwLoc = await new Promise((resolve) => {
    const u = new URL(`${BASE}/temple/`);
    http
      .get({ host: u.hostname, port: u.port, path: u.pathname, headers: { host: "www.shanishingnapurtemple.com" } }, (r) => {
        r.resume();
        resolve(`${r.statusCode} ${r.headers.location ?? ""}`);
      })
      .on("error", (e) => resolve(e.message));
  });
  if (!/^30[18] https:\/\/shanishingnapurtemple\.com\/temple\/$/.test(wwwLoc)) err("www host", `expected 308 to apex, got ${wwwLoc}`);

  const notFound = await fetch(`${BASE}/this-page-does-not-exist/`);
  if (notFound.status !== 404) err("/this-page-does-not-exist/", `expected 404, got ${notFound.status}`);

  console.log(`\nCrawled ${seen.size} URLs · ${indexable.size} indexable · ${sitemapPaths.size} in sitemap`);
  if (warnings.length) console.log(`\n⚠ ${warnings.length} warning(s):\n  ${warnings.join("\n  ")}`);
  if (errors.length) {
    console.log(`\n✖ ${errors.length} error(s):\n  ${errors.join("\n  ")}`);
    process.exitCode = 1;
  } else console.log("\n✔ No SEO or link errors found.");
} finally {
  server?.kill();
}
