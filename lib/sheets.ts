"use client";

// ==========================================================================
//  Google Sheets dynamic data layer (port of the original sheets.js).
//  Content is read live from the DMS Google Sheet via the gviz API, so
//  updating a cell + reloading the page updates the site instantly.
//  Forms POST to the Apps Script web app (see script.gs in the old project).
// ==========================================================================

import { useEffect, useState } from "react";

export const DMS_SHEET_ID = "1ZRLgCnOEvEO0hJo2kyUpl_yP3E6e8fdwvWJUUfcv5qY";
// After deploying script.gs, paste its /exec URL here (or set the env var
// NEXT_PUBLIC_DMS_APPS_SCRIPT_URL). Until then, forms degrade gracefully.
export const DMS_APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_DMS_APPS_SCRIPT_URL ?? "";

export type SheetRow = Record<string, string>;

export async function fetchSheet(sheetName: string): Promise<SheetRow[]> {
  if (!DMS_SHEET_ID) return [];
  // Cache-bust + no-store so edits in the sheet show on the next page load
  // instead of being served from a stale cache.
  const url = `https://docs.google.com/spreadsheets/d/${DMS_SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(
    sheetName
  )}&_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/);
  if (!match) return [];
  const json = JSON.parse(match[1]);
  const cols: string[] = json.table.cols.map((c: { label?: string }) =>
    (c.label || "").trim()
  );
  type Cell = { v: unknown } | null;
  return (json.table.rows as { c: Cell[] }[])
    .filter((row) => row.c && row.c.some((cell) => cell && cell.v !== null && cell.v !== ""))
    .map((row) => {
      const obj: SheetRow = {};
      row.c.forEach((cell, i) => {
        obj[cols[i]] = cell && cell.v !== null ? String(cell.v).trim() : "";
      });
      return obj;
    });
}

/** Hook: fetch a sheet tab once on mount; returns null until loaded. */
export function useSheet(sheetName: string): SheetRow[] | null {
  const [rows, setRows] = useState<SheetRow[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchSheet(sheetName)
      .then((r) => { if (alive && r.length) setRows(r); })
      .catch((e) => console.warn(`DMS: ${sheetName} load failed`, e));
    return () => { alive = false; };
  }, [sheetName]);
  return rows;
}

// -- Helpers (ported verbatim in behaviour) --------------------------------

export function pick(row: SheetRow | undefined, names: string[]): string {
  if (!row) return "";
  const keys = Object.keys(row);
  const norm = (v: string) => String(v || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const name of names) {
    if (row[name] != null && String(row[name]).trim() !== "") return String(row[name]).trim();
    const wanted = norm(name);
    const key = keys.find((k) => norm(k) === wanted);
    if (key && row[key] != null && String(row[key]).trim() !== "") return String(row[key]).trim();
  }
  return "";
}

export function slugify(v: string): string {
  return (
    String(v || "item")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || "item"
  );
}

export function initials(name: string): string {
  return (name || "?")
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function parseSheetDate(str: string): Date | null {
  if (!str) return null;
  const m = String(str).match(/^Date\((\d+),(\d+),(\d+)/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function formatSheetDate(str: string): string {
  const d = parseSheetDate(str);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function shortMonth(str: string): string {
  const d = parseSheetDate(str);
  return d ? d.toLocaleDateString("en-US", { month: "short" }) : "";
}

// Sheets stores a duration as a time-of-day value, e.g. Date(1899,11,30,1,0,23).
// Render it as "1h 00m" (or "45m"). Plain strings like "45 min" pass through.
export function formatDuration(str: string): string {
  if (!str) return "";
  const m = String(str).match(/^Date\(\d+,\d+,\d+,(\d+),(\d+)(?:,(\d+))?/);
  if (m) {
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (h > 0) return `${h}h ${String(min).padStart(2, "0")}m`;
    if (min > 0) return `${min}m`;
    return "";
  }
  return str;
}

// Google Drive image URL -> displayable thumbnail (local paths pass through)
function driveId(url: string): string {
  if (!url) return "";
  url = url.trim();
  let m = url.match(/\/d\/([\w-]{20,})/);
  if (m) return m[1];
  m = url.match(/[?&]id=([\w-]{20,})/);
  if (m) return m[1];
  m = url.match(/googleusercontent\.com\/d\/([\w-]{20,})/);
  if (m) return m[1];
  if (/^[\w-]{25,}$/.test(url)) return url;
  return "";
}

export function driveImg(url: string, size = "w800"): string {
  if (!url) return "";
  url = url.trim();
  if (!/google\.com|googleusercontent\.com/.test(url) && !/^[\w-]{25,}$/.test(url)) return url;
  const id = driveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=${size}` : url;
}

// -- Spam gate (honeypot + time-on-page + junk-name) -----------------------

const loadTs = Date.now();

function looksJunk(text?: string): boolean {
  if (!text) return false;
  const s = text.trim();
  if (s.length > 80) return true; // absurdly long name = bot
  if (/https?:\/\/|www\.|\[url=|<a\s/i.test(s)) return true; // links in a name field = bot
  return false;
}

export function spamBlock(form: HTMLFormElement, ...names: (string | undefined)[]): boolean {
  // 1) Honeypot — a hidden field only bots fill. (Named "dms_hp" rather than
  //    "website" so browser autofill never populates it and blocks real users.)
  const hp = form.querySelector<HTMLInputElement>('input[name="dms_hp"], .dms-hp input');
  if (hp && hp.value.trim()) return true;
  // 2) Submitted faster than a human could (sub-second) — likely a bot.
  if (Date.now() - loadTs < 800) return true;
  // 3) Obvious junk (URLs / absurd length) in a name field.
  if (names.some(looksJunk)) return true;
  return false;
}

// -- Send a lead to the Apps Script (fire-and-forget) ----------------------

export async function sendLead(payload: Record<string, string>): Promise<void> {
  if (!DMS_APPS_SCRIPT_URL) {
    console.warn("DMS: DMS_APPS_SCRIPT_URL not set; lead not sent.", payload);
    return;
  }
  try {
    await fetch(DMS_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("DMS: lead send failed", e);
  }
}
