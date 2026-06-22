// Loads a transcript (Google Doc or Drive VTT/txt) and parses it for inline
// display. Browser fetches to Google are CORS-blocked, so we try, in order:
//   1. the DMS Apps Script proxy (?docUrl=… or ?action=getTranscript&id=…)
//   2. that same proxy wrapped in a public CORS proxy
//   3. the direct export URL wrapped in a public CORS proxy
//   4. the direct export URL
// (Same strategy the RIDA site uses.)

const APPS = process.env.NEXT_PUBLIC_DMS_APPS_SCRIPT_URL ?? "";

const CORS_WRAPS: ((u: string) => string)[] = [
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
];

function docExportUrl(url: string): string | null {
  const m = url.match(/docs\.google\.com\/document\/d\/([\w-]+)/);
  return m ? `https://docs.google.com/document/d/${m[1]}/export?format=txt` : null;
}
function driveId(url: string): string {
  const m = url.match(/\/d\/([\w-]{20,})/) || url.match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : "";
}
function looksLikeHtml(t: string): boolean {
  const v = t.trim().toLowerCase();
  return v.startsWith("<!doctype html") || v.startsWith("<html") || v.includes("<head>");
}
// The form-handler returns a small JSON envelope (health check / error) when the
// transcript proxy isn't deployed — never treat that as transcript text.
function looksLikeEnvelope(t: string): boolean {
  const v = t.trim();
  if (!v.startsWith("{") || v.length > 1200) return false;
  try {
    const j = JSON.parse(v);
    return (
      j && (j.service !== undefined || j.forms !== undefined || j.ok !== undefined || j.status === "error")
    );
  } catch {
    return false;
  }
}

export async function fetchTranscript(url: string): Promise<string> {
  const exportUrl = docExportUrl(url);
  const direct = exportUrl || url;
  const id = driveId(url);

  const candidates: { u: string; json?: boolean }[] = [];
  // 1. Apps Script proxy (reliable once deployed with the doc proxy).
  if (APPS) {
    if (exportUrl) candidates.push({ u: `${APPS}?docUrl=${encodeURIComponent(exportUrl)}` });
    else if (id) candidates.push({ u: `${APPS}?action=getTranscript&id=${encodeURIComponent(id)}`, json: true });
  }
  // 2. Public CORS proxies on the direct export URL (works for shared docs).
  CORS_WRAPS.forEach((w) => candidates.push({ u: w(direct) }));
  // 3. Direct (works only if the source happens to send CORS headers).
  candidates.push({ u: direct });

  let lastErr: unknown;
  for (const c of candidates) {
    try {
      const res = await fetch(c.u);
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      let text = await res.text();
      if (c.json) {
        try {
          const j = JSON.parse(text);
          if (j.status === "ok" && j.content) text = j.content;
          else {
            lastErr = new Error(j.error || "proxy error");
            continue;
          }
        } catch {
          continue;
        }
      }
      if (!text || !text.trim()) continue;
      if (looksLikeHtml(text)) {
        lastErr = new Error("received HTML, not the document");
        continue;
      }
      if (looksLikeEnvelope(text)) {
        lastErr = new Error("proxy not deployed (got handler response)");
        continue;
      }
      if (/^ERROR:/i.test(text.trim())) {
        lastErr = new Error(text.trim().slice(0, 120));
        continue;
      }
      return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Could not load transcript");
}

export interface TranscriptLine {
  speaker?: string;
  time?: string;
  text: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function isVTT(t: string): boolean {
  return /^WEBVTT/i.test(t.replace(/^﻿/, "").trim());
}

function parseVTT(text: string): TranscriptLine[] {
  const raw = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const lines = raw.split("\n");
  const out: TranscriptLine[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line || /^(WEBVTT|NOTE|STYLE|REGION)/i.test(line) || /^\d+$/.test(line)) {
      i++;
      continue;
    }
    if (line.includes(" --> ")) {
      const tm = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)/);
      let time = tm ? tm[1] : "";
      if (time && time.split(":").length === 2) time = "00:" + time;
      i++;
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim()) {
        buf.push(lines[i]);
        i++;
      }
      if (!buf.length) continue;
      let joined = buf.join(" ");
      let speaker = "";
      const v = joined.match(/^<v\s+([^>]+)>/i);
      if (v) speaker = v[1].trim();
      let content = decodeEntities(joined.replace(/<[^>]+>/g, "").trim());
      if (!speaker) {
        const cm = content.match(/^([A-Z][A-Za-z .'-]{0,34}):\s+(.+)/);
        if (cm) {
          speaker = cm[1].trim();
          content = cm[2].trim();
        }
      }
      if (content && !/^\[?silence\]?$/i.test(content))
        out.push({ speaker: speaker || undefined, time: time || undefined, text: content });
      continue;
    }
    i++;
  }
  return out;
}

// Handles several transcript shapes: "[00:00:25 --> 00:04:58] Speaker (Role):"
// headers, single "[00:00:25] Speaker:" timestamps, bare "HH:MM:SS text" lines,
// plain "Speaker: text" lines, and free paragraphs.
function parsePlain(text: string): TranscriptLine[] {
  const lines = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  const out: TranscriptLine[] = [];
  let cur: TranscriptLine | null = null;

  // Timestamps may be wrapped in [ ] or ( ) — or bare.
  const rangeRe = /^[[(]?(\d{1,2}:\d{2}(?::\d{2})?)[.\d]*\s*(?:-->|→|—|–|-)\s*[\d:.]+[\])]?\s*(.*)$/;
  const singleRe = /^[[(]?(\d{1,2}:\d{2}(?::\d{2})?)[.\d]*[\])]?\s+(.*)$/;
  const speakerColonRe = /^([A-Z][A-Za-z0-9 .,'&()\/-]{1,46}):\s+(.+)$/;

  const push = () => {
    if (cur && cur.text.trim()) out.push(cur);
    cur = null;
  };
  // Split a "Speaker (Role): rest" trailer into {speaker, text}.
  const splitSpeaker = (rest: string): { speaker?: string; text: string } => {
    const r = rest.trim();
    const m = r.match(/^([A-Z][A-Za-z0-9 .,'&()\/-]{0,46}?):\s*(.*)$/);
    if (m && m[1].trim().split(/\s+/).length <= 6) return { speaker: m[1].trim(), text: m[2].trim() };
    // No colon but short + looks like a name → treat whole as speaker label.
    if (r && r.length <= 40 && !/[.!?]$/.test(r) && /^[A-Z]/.test(r)) return { speaker: r, text: "" };
    return { text: r };
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      push();
      continue;
    }
    const range = line.match(rangeRe);
    if (range) {
      push();
      const { speaker, text } = splitSpeaker(range[2] || "");
      cur = { time: range[1], speaker, text };
      continue;
    }
    const single = line.match(singleRe);
    if (single && single[2]) {
      push();
      const { speaker, text } = splitSpeaker(single[2]);
      cur = { time: single[1], speaker, text };
      continue;
    }
    if (!cur) {
      const c = line.match(speakerColonRe);
      if (c && c[1].trim().split(/\s+/).length <= 6) {
        out.push({ speaker: c[1].trim(), text: c[2].trim() });
        continue;
      }
    }
    if (cur) cur.text = cur.text ? `${cur.text} ${line}` : line;
    else out.push({ text: line });
  }
  push();

  return out.filter(
    (l, i) => !(i === 0 && !l.speaker && !l.time && /transcript|—/i.test(l.text))
  );
}

// ---- Description / write-up doc parsing -----------------------------------
export interface DocBlock {
  type: "h2" | "h3" | "p" | "li";
  text: string;
}

const DOC_SECTION =
  /^(overview|key topics covered|key topics|key takeaways|takeaways|summary|highlights|what you'?ll learn|about( this session)?)\s*:?$/i;

/** Parse a write-up doc (Overview / sub-headings / Key Takeaways list). */
export function parseDoc(text: string): DocBlock[] {
  const lines = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: DocBlock[] = [];
  let inTakeaways = false;
  let sawSection = false;
  let skippedTitle = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^https?:\/\/\S+$/i.test(line)) continue; // stray doc URL
    if (/^[_\-=*–—·.\s]{3,}$/.test(line)) continue; // divider lines (____, ----, etc.)

    if (DOC_SECTION.test(line)) {
      blocks.push({ type: "h2", text: line.replace(/:$/, "") });
      inTakeaways = /takeaway/i.test(line);
      sawSection = true;
      continue;
    }
    // Skip the doc's own title line (the first line before any section heading).
    if (!sawSection && !skippedTitle) {
      skippedTitle = true;
      continue;
    }
    if (inTakeaways) {
      blocks.push({ type: "li", text: line.replace(/^[•*\-–—\d.)\s]+/, "").trim() || line });
      continue;
    }
    // Sub-heading: short, no ending sentence punctuation.
    if (line.length < 92 && !/[.!?]$/.test(line)) {
      blocks.push({ type: "h3", text: line.replace(/:$/, "") });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }
  return blocks;
}

export function parseTranscript(text: string): TranscriptLine[] {
  if (isVTT(text)) {
    const e = parseVTT(text);
    if (e.length) return e;
  }
  return parsePlain(text);
}
