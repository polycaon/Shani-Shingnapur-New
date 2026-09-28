import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { applyTokens } from "./tokens";
import type { FaqKey } from "@/data/faqs";
import type { SourceKey } from "@/data/sources";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Disclaimer = "temple" | "travel" | "both";

export interface PageMeta {
  /** Visible H1. */
  title: string;
  /** <title> tag. Defaults to `title`. */
  metaTitle?: string;
  description: string;
  /** Short label for cards, breadcrumbs and related links. */
  shortTitle?: string;
  cardText?: string;
  published?: string;
  updated: string;
  /** Schema.org types beyond the default for the page kind. */
  schema?: ("TouristAttraction" | "Place" | "HinduTemple")[];
  kind?: "article" | "hub" | "legal" | "tool";
  faqs?: string | FaqKey[];
  related?: string[];
  sources?: SourceKey[];
  quickAnswer?: string;
  toc?: boolean;
  noindex?: boolean;
  disclaimer?: Disclaimer;
  order?: number;
  /** Blog only. */
  category?: string;
  tags?: string[];
  /** Hide from hub listings (e.g. legal pages). */
  unlisted?: boolean;
}

export type Segment =
  | { type: "html"; html: string }
  | { type: "component"; name: string; props: Record<string, string> }
  | { type: "callout"; variant: string; title?: string; html: string };

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface ContentEntry {
  /** Canonical path with leading and trailing slash, e.g. /temple/history/ */
  url: string;
  collection: "pages" | "blog";
  slug: string[];
  meta: PageMeta;
  segments: Segment[];
  toc: TocItem[];
  /** Plain text for search and validation. */
  plainText: string;
  wordCount: number;
  file: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createMarked(toc: TocItem[], usedIds: Set<string>) {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const text = inner.replace(/<[^>]+>/g, "");
        let id = slugify(text) || "section";
        let n = 2;
        while (usedIds.has(id)) id = `${slugify(text)}-${n++}`;
        usedIds.add(id);
        if (depth === 2 || depth === 3) toc.push({ id, text, depth });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : "";
        if (/^https?:\/\//.test(href)) {
          return `<a href="${href}"${t} rel="noopener" target="_blank">${text}<span class="sr-only"> (opens in a new tab)</span></a>`;
        }
        return `<a href="${href}"${t}>${text}</a>`;
      },
      table(token: Tokens.Table) {
        const head = token.header
          .map((c) => `<th scope="col"${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`)
          .join("");
        const body = token.rows
          .map(
            (row) =>
              `<tr>${row
                .map((c, i) =>
                  i === 0
                    ? `<th scope="row">${this.parser.parseInline(c.tokens)}</th>`
                    : `<td>${this.parser.parseInline(c.tokens)}</td>`,
                )
                .join("")}</tr>`,
          )
          .join("");
        return `<div class="table-wrap" role="region" tabindex="0" aria-label="Scrollable table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`;
      },
    },
  });
  return marked;
}

const COMPONENT_RE = /^\[\[([a-z-]+)((?:\s+[a-z-]+=(?:"[^"]*"|\S+))*)\s*\]\]$/;

function parseProps(raw: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const m of raw.matchAll(/([a-z-]+)=(?:"([^"]*)"|(\S+))/g)) props[m[1]] = m[2] ?? m[3];
  return props;
}

/** Split Markdown into HTML, component and callout segments. */
export function renderMarkdown(source: string, file: string) {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const marked = createMarked(toc, used);
  const segments: Segment[] = [];
  const lines = applyTokens(source, file).split("\n");
  let buffer: string[] = [];

  const flush = () => {
    const md = buffer.join("\n").trim();
    if (md) segments.push({ type: "html", html: marked.parse(md) as string });
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const comp = line.trim().match(COMPONENT_RE);
    if (comp) {
      flush();
      segments.push({ type: "component", name: comp[1], props: parseProps(comp[2]) });
      continue;
    }
    const callout = line.match(/^:::(note|tip|warning|belief|verify|info)\s*(.*)$/);
    if (callout) {
      flush();
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") inner.push(lines[i++]);
      if (i >= lines.length) throw new Error(`Unclosed ::: callout in ${file}`);
      segments.push({
        type: "callout",
        variant: callout[1],
        title: callout[2]?.trim() || undefined,
        html: marked.parse(inner.join("\n")) as string,
      });
      continue;
    }
    buffer.push(line);
  }
  flush();
  return { segments, toc };
}

export function htmlToText(html: string): string {
  return html
    .replace(/<span class="sr-only">.*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".md") ? [p] : [];
  });
}

function toIsoDate(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function loadEntry(file: string, collection: "pages" | "blog"): ContentEntry {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const rel = path.relative(path.join(CONTENT_DIR, collection), file).replace(/\\/g, "/").replace(/\.md$/, "");
  const parts = rel.split("/").filter((p) => p !== "index");
  const slug = collection === "blog" ? ["blog", ...parts] : parts;
  const url = slug.length ? `/${slug.join("/")}/` : "/";
  const meta = { ...data, updated: toIsoDate(data.updated), published: toIsoDate(data.published) } as PageMeta;
  if (!meta.title || !meta.description || !meta.updated) {
    throw new Error(`${file}: front matter requires title, description and updated`);
  }
  const { segments, toc } = renderMarkdown(content, file);
  const plainText = htmlToText(
    segments.map((s) => (s.type === "html" || s.type === "callout" ? s.html : "")).join(" "),
  );
  return {
    url,
    collection,
    slug,
    meta,
    segments,
    toc,
    plainText,
    wordCount: plainText.split(/\s+/).filter(Boolean).length,
    file: path.relative(process.cwd(), file),
  };
}

let cache: ContentEntry[] | null = null;

export function getAllEntries(): ContentEntry[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const pages = walk(path.join(CONTENT_DIR, "pages")).map((f) => loadEntry(f, "pages"));
  const blog = walk(path.join(CONTENT_DIR, "blog")).map((f) => loadEntry(f, "blog"));
  cache = [...pages, ...blog];
  return cache;
}

export function getPages() {
  return getAllEntries().filter((e) => e.collection === "pages");
}

export function getPosts() {
  return getAllEntries()
    .filter((e) => e.collection === "blog")
    .sort((a, b) => (b.meta.published ?? b.meta.updated).localeCompare(a.meta.published ?? a.meta.updated));
}

export function getEntryByUrl(url: string) {
  return getAllEntries().find((e) => e.url === url);
}

/** Direct children of a hub page, sorted by `order` then title. */
export function getChildren(url: string) {
  const depth = url.split("/").filter(Boolean).length;
  return getPages()
    .filter(
      (e) => e.url !== url && e.url.startsWith(url) && e.url.split("/").filter(Boolean).length === depth + 1 && !e.meta.unlisted,
    )
    .sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99) || a.meta.title.localeCompare(b.meta.title));
}

export function shortTitle(e: ContentEntry) {
  return e.meta.shortTitle ?? e.meta.title;
}
