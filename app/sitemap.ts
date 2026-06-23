import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { fetchSheetServer, pickRow } from "@/lib/sheets-server";
import { slugify } from "@/lib/slug";
import { ARCHIVE, UPCOMING_EVENTS } from "@/lib/data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/events",
    "/speakers",
    "/reviews",
    "/partners",
    "/audit",
    "/resources",
    "/contact",
    "/speaker",
  ];

  // Replay + webinar detail pages (live sheet at build, merged with fallback).
  const replayRows = await fetchSheetServer("webinar-replays");
  const replaySlugs = Array.from(
    new Set([
      ...replayRows.map((r) => pickRow(r, ["slug"]) || slugify(pickRow(r, ["title"]))),
      ...ARCHIVE.map((r) => r.slug),
    ])
  ).filter((s) => s && s !== "item");

  const eventRows = await fetchSheetServer("webinars");
  const webinarSlugs = Array.from(
    new Set([
      ...eventRows.map((r) => slugify(pickRow(r, ["title"]))),
      ...UPCOMING_EVENTS.map((e) => slugify(e.title)),
    ])
  ).filter((s) => s && s !== "item");

  const urls = [
    ...staticRoutes,
    ...replaySlugs.map((s) => `/replays/${s}`),
    ...webinarSlugs.map((s) => `/webinars/${s}`),
  ];

  return urls.map((route) => {
    // Match the canonical form (trailingSlash: true emits "/about/"), so the
    // sitemap URL and the page's <link rel="canonical"> are byte-identical.
    const path = route === "" ? "/" : route.endsWith("/") ? route : `${route}/`;
    return {
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency: route.startsWith("/events") || route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : route.includes("/replays/") || route.includes("/webinars/") ? 0.6 : 0.8,
    };
  });
}
