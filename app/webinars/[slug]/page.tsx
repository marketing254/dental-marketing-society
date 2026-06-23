import type { Metadata } from "next";
import WebinarDetailView from "@/components/views/WebinarDetailView";
import JsonLd from "@/components/JsonLd";
import { fetchSheetServer, pickRow, normalizeWebinarRow } from "@/lib/sheets-server";
import { slugify } from "@/lib/slug";
import { eventSchema, breadcrumbSchema } from "@/lib/schema";
import { UPCOMING_EVENTS } from "@/lib/data";

// One static page per upcoming webinar (live sheet at build + static fallback).
export async function generateStaticParams() {
  const rows = await fetchSheetServer("webinars");
  const fromSheet = rows
    .map((r) => slugify(pickRow(r, ["title"])))
    .filter((s) => s && s !== "item");
  const all = Array.from(
    new Set([...fromSheet, ...UPCOMING_EVENTS.map((e) => slugify(e.title))])
  );
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rows = await fetchSheetServer("webinars");
  const row = rows.find((r) => slugify(pickRow(r, ["title"])) === slug);
  const title =
    (row && pickRow(row, ["title"])) ||
    UPCOMING_EVENTS.find((e) => slugify(e.title) === slug)?.title;
  const description =
    (row && pickRow(row, ["description", "subtitle"])) ||
    UPCOMING_EVENTS.find((e) => slugify(e.title) === slug)?.description;
  const desc =
    description || "Register free for an upcoming Dental Marketing Society webinar.";
  return {
    title: title || "Upcoming Webinar",
    description: desc,
    alternates: { canonical: `/webinars/${slug}` },
    openGraph: {
      type: "article",
      title: title || "Upcoming Webinar",
      description: desc,
      url: `/webinars/${slug}`,
    },
  };
}

export default async function WebinarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await fetchSheetServer("webinars");
  const row = rows.find((r) => slugify(pickRow(r, ["title"])) === slug);
  const initial =
    (row && normalizeWebinarRow(row)) ||
    UPCOMING_EVENTS.find((e) => slugify(e.title) === slug) ||
    null;
  return (
    <>
      {initial && (
        <JsonLd
          data={[
            eventSchema(initial, `/webinars/${slug}`),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Webinars & Events", path: "/events" },
              { name: initial.title, path: `/webinars/${slug}` },
            ]),
          ]}
        />
      )}
      <WebinarDetailView slug={slug} initial={initial} />
    </>
  );
}
