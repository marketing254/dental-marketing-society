// Server-side (build-time) Google Sheet fetch — used by generateStaticParams to
// pre-render a page per replay / webinar. Mirrors lib/sheets.ts but runs in Node
// (no CORS). Returns [] when the sheet is private/unreachable, so the build
// gracefully falls back to the static content in lib/data.ts.
export const DMS_SHEET_ID = "1ZRLgCnOEvEO0hJo2kyUpl_yP3E6e8fdwvWJUUfcv5qY";

export type SheetRow = Record<string, string>;

export async function fetchSheetServer(sheetName: string): Promise<SheetRow[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${DMS_SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(
      sheetName
    )}`;
    const res = await fetch(url);
    const text = await res.text();
    const match = text.match(
      /google\.visualization\.Query\.setResponse\(([\s\S]*)\)/
    );
    if (!match) return [];
    const json = JSON.parse(match[1]);
    const cols: string[] = json.table.cols.map((c: { label?: string }) =>
      (c.label || "").trim()
    );
    type Cell = { v: unknown } | null;
    return (json.table.rows as { c: Cell[] }[])
      .filter(
        (row) =>
          row.c && row.c.some((cell) => cell && cell.v !== null && cell.v !== "")
      )
      .map((row) => {
        const obj: SheetRow = {};
        row.c.forEach((cell, i) => {
          obj[cols[i]] = cell && cell.v !== null ? String(cell.v).trim() : "";
        });
        return obj;
      });
  } catch {
    return [];
  }
}

import { slugify } from "./slug";
import type { ArchiveItem, DmsEvent } from "./data";

function parseDate(str: string): Date | null {
  if (!str) return null;
  const m = String(str).match(/^Date\((\d+),(\d+),(\d+)/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
function fmtDate(str: string): string {
  const d = parseDate(str);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
}
function shortMonth(str: string): string {
  const d = parseDate(str);
  return d ? d.toLocaleDateString("en-US", { month: "short" }) : "";
}
function fmtDuration(str: string): string {
  if (!str) return "";
  const m = String(str).match(/^Date\(\d+,\d+,\d+,(\d+),(\d+)/);
  if (m) {
    const h = parseInt(m[1], 10), min = parseInt(m[2], 10);
    if (h > 0) return `${h}h ${String(min).padStart(2, "0")}m`;
    if (min > 0) return `${min}m`;
    return "";
  }
  return str;
}
function driveImg(url: string): string {
  if (!url) return "";
  url = url.trim();
  if (!/google\.com|googleusercontent\.com/.test(url) && !/^[\w-]{25,}$/.test(url)) return url;
  let m = url.match(/\/d\/([\w-]{20,})/) || url.match(/[?&]id=([\w-]{20,})/);
  const id = m ? m[1] : /^[\w-]{25,}$/.test(url) ? url : "";
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200` : url;
}

/** Normalize a `webinar-replays` row to the client ArchiveItem shape (build time). */
export function normalizeReplayRow(row: SheetRow): ArchiveItem {
  return {
    slug: pickRow(row, ["slug"]) || slugify(pickRow(row, ["title"])),
    title: pickRow(row, ["title"]),
    subtitle: pickRow(row, ["subtitle"]) || undefined,
    date: fmtDate(pickRow(row, ["date"])) || pickRow(row, ["date"]),
    duration: fmtDuration(pickRow(row, ["duration", "length"])) || undefined,
    category: pickRow(row, ["category"]) || undefined,
    vimeo: pickRow(row, ["vimeo_url", "video_url", "youtube_url"]) || undefined,
    image: driveImg(pickRow(row, ["image_url", "thumbnail_url", "image_urls"])) || undefined,
    summary: pickRow(row, ["summary"]) || undefined,
    description: pickRow(row, ["description"]) || undefined,
    transcript: pickRow(row, ["transcript"]) || undefined,
  };
}

/** Normalize a `webinars` row to the client DmsEvent shape (build time). */
export function normalizeWebinarRow(row: SheetRow): DmsEvent {
  const dateRaw = pickRow(row, ["date_iso", "date"]);
  const d = parseDate(dateRaw);
  return {
    day: pickRow(row, ["day"]) || (d ? String(d.getDate()) : ""),
    month: shortMonth(dateRaw) || (pickRow(row, ["month_year"]).split(" ")[0] || "").slice(0, 3),
    dateLabel: fmtDate(dateRaw),
    iso: d ? d.toISOString() : undefined,
    title: pickRow(row, ["title"]),
    description: pickRow(row, ["description", "subtitle"]),
    time: pickRow(row, ["time"]) || undefined,
    panelists: pickRow(row, ["panelists", "Panelists"]).split("|").map((p) => p.trim()).filter(Boolean),
    image: driveImg(pickRow(row, ["image_url", "image_urls"])) || undefined,
    registerUrl: pickRow(row, ["register_url"]) || "/msm",
  };
}

export interface ServerReview {
  name: string;
  firm: string;
  text: string;
  rating: number;
  date?: string;
}

/** Fetch + normalize the `reviews` tab at build time (for review schema). */
export async function fetchReviewsServer(): Promise<ServerReview[]> {
  const rows = await fetchSheetServer("reviews");
  const clean = (s: string) => String(s || "").replace(/\s+/g, " ").trim();
  return rows
    .filter((r) => pickRow(r, ["review_text", "review", "testimonial"]))
    .map((r): ServerReview => {
      const ratingRaw = parseInt(pickRow(r, ["rating"]) || "5", 10);
      return {
        name: clean(pickRow(r, ["reviewer_name", "name"])) || "Anonymous",
        firm: clean(pickRow(r, ["firm_name", "role", "practice"])),
        text: clean(pickRow(r, ["review_text", "review", "testimonial"])),
        rating: Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : ratingRaw)),
        date: fmtDate(pickRow(r, ["date"])) || undefined,
      };
    })
    // Only real, attributable reviews are eligible for schema (Google requires
    // a named author and forbids placeholder/fake content).
    .filter((r) => r.name && r.name !== "Anonymous" && !/\[.*\]/.test(r.name) && r.text);
}

export function pickRow(row: SheetRow | undefined, names: string[]): string {
  if (!row) return "";
  const keys = Object.keys(row);
  const norm = (v: string) =>
    String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const name of names) {
    if (row[name] != null && String(row[name]).trim() !== "")
      return String(row[name]).trim();
    const wanted = norm(name);
    const key = keys.find((k) => norm(k) === wanted);
    if (key && row[key] != null && String(row[key]).trim() !== "")
      return String(row[key]).trim();
  }
  return "";
}
