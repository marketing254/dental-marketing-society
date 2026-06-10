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
  slugify,
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
  type TeamMember,
  type Review,
  type Faq,
} from "@/lib/data";

export function useUpcomingEvents(): DmsEvent[] {
  const rows = useSheet("events");
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
  const rows = useSheet("event-panels");
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
        title: pick(r, ["title"]),
        date: pick(r, ["date"]),
        slug: pick(r, ["slug"]) || slugify(pick(r, ["title"])),
        vimeo: pick(r, ["vimeo_url"]) || undefined,
      }));
    return items.length ? items : ARCHIVE;
  }, [rows]);
}

export function useSpeakers(): Speaker[] {
  const rows = useSheet("experts");
  return useMemo(() => {
    if (!rows) return SPEAKERS;
    const list = rows
      .filter((r) => pick(r, ["type"]).toLowerCase() === "speaker")
      .map((r): Speaker => ({
        name: pick(r, ["name"]),
        role: pick(r, ["role"]),
        photo: driveImg(pick(r, ["photo_url"])) || undefined,
        linkedin: pick(r, ["linkedin_url"]) || undefined,
      }));
    return list.length ? list : SPEAKERS;
  }, [rows]);
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
    const list = rows
      .filter((r) => pick(r, ["context"]).toLowerCase() === context)
      .map((r): Review => ({
        context,
        name: pick(r, ["reviewer_name"]),
        firm: pick(r, ["firm_name"]),
        text: pick(r, ["review_text"]),
        photo: driveImg(pick(r, ["photo_url"])) || undefined,
      }));
    return list.length ? list : fallback;
  }, [rows, context]);
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

export function usePartners() {
  const rows = useSheet("partners");
  return useMemo(() => {
    if (!rows) return PARTNERS;
    const list = rows
      .filter((r) => pick(r, ["logo_url"]))
      .map((r) => ({
        name: pick(r, ["name"]),
        logo: driveImg(pick(r, ["logo_url"])),
      }));
    return list.length ? list : PARTNERS;
  }, [rows]);
}
