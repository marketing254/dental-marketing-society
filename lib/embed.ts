// Turn a Vimeo/YouTube id or URL (from the sheet) into an embeddable player URL.
export function videoEmbedUrl(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (/^\d+$/.test(s)) return `https://player.vimeo.com/video/${s}`;
  let m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  if (/^https?:\/\//.test(s)) return s;
  return null;
}
