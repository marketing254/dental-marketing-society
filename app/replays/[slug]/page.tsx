import type { Metadata } from "next";
import ReplayDetailView from "@/components/views/ReplayDetailView";
import { fetchSheetServer, pickRow, normalizeReplayRow } from "@/lib/sheets-server";
import { slugify } from "@/lib/slug";
import { ARCHIVE } from "@/lib/data";

// One static page per replay. Slugs come from the live sheet at build time
// (when it's public), merged with the static fallback list. New replays appear
// after a rebuild.
export async function generateStaticParams() {
  const rows = await fetchSheetServer("webinar-replays");
  const fromSheet = rows
    .map((r) => pickRow(r, ["slug"]) || slugify(pickRow(r, ["title"])))
    .filter((s) => s && s !== "item");
  const all = Array.from(new Set([...fromSheet, ...ARCHIVE.map((r) => r.slug)]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rows = await fetchSheetServer("webinar-replays");
  const row = rows.find(
    (r) => (pickRow(r, ["slug"]) || slugify(pickRow(r, ["title"]))) === slug
  );
  const title =
    (row && pickRow(row, ["title"])) || ARCHIVE.find((r) => r.slug === slug)?.title;
  return {
    title: title ? `${title}, Webinar Replay` : "Webinar Replay",
    description: title
      ? `Watch the free replay of the Dental Marketing Society webinar: ${title}.`
      : "Watch free Dental Marketing Society webinar replays on demand.",
    alternates: { canonical: `/replays/${slug}` },
  };
}

export default async function ReplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await fetchSheetServer("webinar-replays");
  const row = rows.find(
    (r) => (pickRow(r, ["slug"]) || slugify(pickRow(r, ["title"]))) === slug
  );
  const initial =
    (row && normalizeReplayRow(row)) ||
    ARCHIVE.find((r) => r.slug === slug) ||
    null;
  return <ReplayDetailView slug={slug} initial={initial} />;
}
