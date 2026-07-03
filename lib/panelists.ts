import type { Panelist } from "./data";

// Parse the sheet's "Panelists" cell into structured panelists.
// Format (pipe-separated, one per panelist):
//   "Wes Read | Lisa Philp"                       → names only
//   "Wes Read : <driveUrl> | Lisa Philp : <url>"  → name + headshot
// The image URL is everything after the FIRST ":" (so the "https://" colon in
// the Drive link is preserved). `toImg` converts the raw URL to a thumbnail.
export function parsePanelists(
  raw: string,
  toImg: (url: string) => string
): Panelist[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((seg) => seg.trim())
    .filter(Boolean)
    .map((s): Panelist => {
      const idx = s.indexOf(":");
      // A leading "http" means the whole segment is a bare URL, not "name: url".
      if (idx > 0 && !/^https?:/i.test(s)) {
        const name = s.slice(0, idx).trim();
        const url = s.slice(idx + 1).trim();
        return url ? { name, image: toImg(url) } : { name };
      }
      return { name: s };
    })
    .filter((p) => p.name);
}
