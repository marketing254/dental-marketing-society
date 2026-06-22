"use client";

// Hooks that hydrate the static fallback content with live Google Sheet data
// (mirrors the renderers in the original sheets.js).

import { useMemo } from "react";
import {
  useSheet,
  pick,
  driveImg,
  parseSheetDate,
  formatSheetDate,
  shortMonth,
  formatDuration,
  slugify,
  type SheetRow,
} from "@/lib/sheets";
import {
  UPCOMING_EVENTS,
  ARCHIVE,
  SPEAKERS,
  TEAM,
  REVIEWS,
  FAQS,
  PARTNERS,
  type DmsEvent,
  type ArchiveItem,
  type Speaker,
  type SpeakerContact,
  type TeamMember,
  type Review,
  type Faq,
} from "@/lib/data";

// Maps a contact label (e.g. "LinkedIn", "Website") to a normalized platform key.
function platformKey(label: string): string {
  const k = label.toLowerCase().replace(/[^a-z]/g, "");
  if (k.includes("linkedin")) return "linkedin";
  if (k.includes("instagram") || k === "ig") return "instagram";
  if (k.includes("facebook") || k === "fb") return "facebook";
  if (k.includes("youtube") || k === "yt") return "youtube";
  if (k.includes("twitter") || k === "x") return "twitter";
  if (k.includes("email") || k.includes("mail")) return "email";
  if (k.includes("tiktok")) return "tiktok";
  return "website";
}

/**
 * Parse a contacts cell into a list of links. Accepts one entry per line (or
 * separated by "|"), each like "LinkedIn: https://…", plus bare URLs.
 *   LinkedIn: https://www.linkedin.com/in/…
 *   Instagram: https://www.instagram.com/…
 *   Website: https://example.com/
 */
export function parseContacts(raw: string): SpeakerContact[] {
  if (!raw) return [];
  return raw
    .split(/[\n|]+/)
    .map((line): SpeakerContact | null => {
      const s = line.trim();
      if (!s) return null;
      if (/^https?:\/\//i.test(s)) return { label: "Website", url: s, platform: "website" };
      const m = s.match(/^([^:]+?):\s*(.+)$/);
      if (!m) return null;
      const label = m[1].trim();
      let url = m[2].trim();
      const platform = platformKey(label);
      if (platform === "email" || (url.includes("@") && !/^https?:/i.test(url) && !url.startsWith("mailto:"))) {
        url = url.startsWith("mailto:") ? url : `mailto:${url}`;
        return { label: "Email", url, platform: "email" };
      }
      if (!/^https?:\/\//i.test(url) && !url.startsWith("mailto:")) url = `https://${url}`;
      return { label, url, platform };
    })
    .filter((c): c is SpeakerContact => c !== null);
}

export function useUpcomingEvents(): DmsEvent[] {
  const rows = useSheet("webinars");
  return useMemo(() => {
    if (!rows) return UPCOMING_EVENTS;
    const events = rows
      .filter((r) => pick(r, ["title"]))
      .sort(
        (a, b) =>
          (parseSheetDate(pick(a, ["date_iso", "date"]))?.getTime() ?? 0) -
          (parseSheetDate(pick(b, ["date_iso", "date"]))?.getTime() ?? 0)
      )
      .map((r): DmsEvent => {
        const dateRaw = pick(r, ["date_iso", "date"]);
        const d = parseSheetDate(dateRaw);
        return {
          day: pick(r, ["day"]) || (d ? String(d.getDate()) : ""),
          month: shortMonth(dateRaw) || (pick(r, ["month_year"]).split(" ")[0] || "").slice(0, 3),
          dateLabel: formatSheetDate(dateRaw),
          iso: d ? d.toISOString() : undefined,
          title: pick(r, ["title"]),
          description: pick(r, ["description", "subtitle"]),
          time: pick(r, ["time"]) || undefined,
          panelists: pick(r, ["panelists"]).split("|").map((p) => p.trim()).filter(Boolean),
          image: driveImg(pick(r, ["image_url", "image_urls"])) || undefined,
          registerUrl: pick(r, ["register_url"]) || "/audit",
        };
      });
    return events.length ? events : UPCOMING_EVENTS;
  }, [rows]);
}

export function useArchive(): ArchiveItem[] {
  const rows = useSheet("webinar-replays");
  return useMemo(() => {
    if (!rows) return ARCHIVE;
    const items = rows
      .filter((r) => pick(r, ["title"]))
      .sort(
        (a, b) =>
          (parseSheetDate(pick(b, ["date"]))?.getTime() ?? 0) -
          (parseSheetDate(pick(a, ["date"]))?.getTime() ?? 0)
      )
      .map((r): ArchiveItem => ({
        slug: pick(r, ["slug"]) || slugify(pick(r, ["title"])),
        title: pick(r, ["title"]),
        subtitle: pick(r, ["subtitle"]) || undefined,
        date: formatSheetDate(pick(r, ["date"])) || pick(r, ["date"]),
        duration: formatDuration(pick(r, ["duration", "length"])) || undefined,
        category: pick(r, ["category"]) || undefined,
        vimeo: pick(r, ["vimeo_url", "video_url", "youtube_url"]) || undefined,
        image: driveImg(pick(r, ["image_url", "thumbnail_url", "image_urls"])) || undefined,
        summary: pick(r, ["summary"]) || undefined,
        description: pick(r, ["description"]) || undefined,
        transcript: pick(r, ["transcript"]) || undefined,
      }));
    return items.length ? items : ARCHIVE;
  }, [rows]);
}

// Map a person row (from `experts` or `featured_partners`) to a Speaker.
function rowToSpeaker(r: SheetRow): Speaker {
  const contacts = parseContacts(
    pick(r, ["contacts", "contact", "socials", "social", "social_links", "links"])
  );
  const li = pick(r, ["linkedin_url", "linkedin"]);
  const web = pick(r, ["website", "website_url", "url"]);
  const email = pick(r, ["email"]);
  if (li && !contacts.some((c) => c.platform === "linkedin"))
    contacts.push({ label: "LinkedIn", url: li, platform: "linkedin" });
  if (web && !contacts.some((c) => c.platform === "website"))
    contacts.push({ label: "Website", url: web, platform: "website" });
  if (email && !contacts.some((c) => c.platform === "email"))
    contacts.push({ label: "Email", url: `mailto:${email}`, platform: "email" });
  return {
    name: pick(r, ["name"]),
    role: pick(r, ["role", "title", "position"]),
    bio: pick(r, ["bio", "about"]) || undefined,
    photo: driveImg(pick(r, ["photo_url", "image_url", "image_urls", "photo"])) || undefined,
    topic: pick(r, ["topic", "talk", "tags", "session"]) || undefined,
    linkedin: contacts.find((c) => c.platform === "linkedin")?.url,
    contacts: contacts.length ? contacts : undefined,
  };
}

export function useSpeakers(): Speaker[] {
  // Speakers live in `featured_partners` (name/bio/contact/image_url); also
  // include any `experts` rows flagged type=speaker. Whichever you populate,
  // they all show here — paginated.
  const featured = useSheet("featured_partners");
  const experts = useSheet("experts");
  return useMemo(() => {
    if (!featured && !experts) return SPEAKERS;
    const fromExperts = (experts || [])
      .filter((r) => pick(r, ["type"]).toLowerCase() === "speaker" || !pick(r, ["type"]))
      .map(rowToSpeaker);
    const fromFeatured = (featured || []).filter((r) => pick(r, ["name"])).map(rowToSpeaker);
    const seen = new Set<string>();
    const out: Speaker[] = [];
    for (const s of [...fromExperts, ...fromFeatured]) {
      const key = s.name.toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out.length ? out : SPEAKERS;
  }, [featured, experts]);
}

export function useTeam(): TeamMember[] {
  const rows = useSheet("experts");
  return useMemo(() => {
    if (!rows) return TEAM;
    const list = rows
      .filter((r) => pick(r, ["type"]).toLowerCase() === "team")
      .map((r): TeamMember => ({
        name: pick(r, ["name"]),
        role: pick(r, ["role"]),
        bio: pick(r, ["bio"]),
        photo: driveImg(pick(r, ["photo_url"])) || undefined,
      }));
    return list.length ? list : TEAM;
  }, [rows]);
}

export function useReviews(context: Review["context"]): Review[] {
  const rows = useSheet("reviews");
  return useMemo(() => {
    const fallback = REVIEWS.filter((r) => r.context === context);
    if (!rows) return fallback;
    // The reviews tab has no "context" column, so only filter by it when
    // present; otherwise show every review for any context.
    const hasContext = rows.some((r) => pick(r, ["context"]));
    const list = rows
      .filter((r) => pick(r, ["review_text"]))
      .filter((r) => !hasContext || pick(r, ["context"]).toLowerCase() === context)
      .map((r): Review => ({
        context,
        name: pick(r, ["reviewer_name"]),
        firm: pick(r, ["firm_name", "platform"]),
        text: pick(r, ["review_text"]),
        photo: driveImg(pick(r, ["photo_url"])) || undefined,
      }));
    return list.length ? list : fallback;
  }, [rows, context]);
}

/** All reviews (no context filter) for the dedicated /reviews page. */
export function useAllReviews(): Review[] {
  const rows = useSheet("reviews");
  return useMemo(() => {
    if (!rows) return REVIEWS;
    const clean = (s: string) => String(s || "").replace(/\s+/g, " ").trim();
    const list = rows
      .filter((r) => pick(r, ["review_text", "review", "testimonial"]))
      .map((r): Review => {
        const ratingRaw = parseInt(pick(r, ["rating"]) || "5", 10);
        const platformRaw = pick(r, ["platform", "source"]);
        return {
          context: "home",
          name: clean(pick(r, ["reviewer_name", "name"])) || "Anonymous",
          firm: clean(pick(r, ["firm_name", "role", "practice"])),
          text: pick(r, ["review_text", "review", "testimonial"]).trim(),
          photo: driveImg(pick(r, ["photo_url", "image_url"])) || undefined,
          rating: Math.min(5, Math.max(1, isNaN(ratingRaw) ? 5 : ratingRaw)),
          platform: platformRaw.split(/\n|https?:\/\//)[0].trim() || undefined,
          date: clean(pick(r, ["date"])) || undefined,
        };
      });
    return list.length ? list : REVIEWS;
  }, [rows]);
}

export function useFaqs(): Faq[] {
  const rows = useSheet("faqs");
  return useMemo(() => {
    if (!rows) return FAQS;
    const list = rows
      .filter((r) => pick(r, ["question"]))
      .map((r): Faq => ({
        question: pick(r, ["question"]),
        answer: pick(r, ["answer"]),
      }));
    return list.length ? list : FAQS;
  }, [rows]);
}

export interface PartnerItem {
  name: string;
  logo: string;
  url?: string;
  blurb?: string;
}

export function usePartners(): PartnerItem[] {
  const rows = useSheet("featured_partners");
  return useMemo<PartnerItem[]>(() => {
    const fallback: PartnerItem[] = PARTNERS.map((p) => ({ name: p.name, logo: p.logo }));
    if (!rows) return fallback;
    const list = rows
      .filter((r) => pick(r, ["image_url", "logo_url"]))
      .map((r): PartnerItem => {
        const contact = pick(r, ["contact", "url", "website", "link"]);
        return {
          name: pick(r, ["name"]),
          logo: driveImg(pick(r, ["image_url", "logo_url"])),
          url: /^https?:\/\//.test(contact) ? contact : undefined,
          blurb: pick(r, ["bio", "blurb", "description", "about"]) || undefined,
        };
      });
    return list.length ? list : fallback;
  }, [rows]);
}

/** Find a single replay by slug (live sheet first, then static fallback). */
export function useReplay(slug: string): ArchiveItem | null {
  const archive = useArchive();
  return useMemo(() => {
    return (
      archive.find((r) => r.slug === slug) ||
      ARCHIVE.find((r) => r.slug === slug) ||
      null
    );
  }, [archive, slug]);
}

/** Find a single upcoming webinar by slug (live sheet first, then fallback). */
export function useWebinar(slug: string): DmsEvent | null {
  const events = useUpcomingEvents();
  return useMemo(() => {
    return (
      events.find((e) => slugify(e.title) === slug) ||
      UPCOMING_EVENTS.find((e) => slugify(e.title) === slug) ||
      null
    );
  }, [events, slug]);
}
