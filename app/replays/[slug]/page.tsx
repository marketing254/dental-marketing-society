import type { Metadata } from "next";
import ReplayDetailView from "@/components/views/ReplayDetailView";
import JsonLd from "@/components/JsonLd";
import { fetchSheetServer, pickRow, normalizeReplayRow } from "@/lib/sheets-server";
import { slugify } from "@/lib/slug";
import { videoSchema, breadcrumbSchema } from "@/lib/schema";
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
  const desc = title
    ? `Watch the free replay of the Dental Marketing Society webinar: ${title}.`
    : "Watch free Dental Marketing Society webinar replays on demand.";
  return {
    title: title ? `${title}, Webinar Replay` : "Webinar Replay",
    description: desc,
    alternates: { canonical: `/replays/${slug}` },
    openGraph: {
      type: "video.other",
      title: title ? `${title}, Webinar Replay` : "Webinar Replay",
      description: desc,
      url: `/replays/${slug}`,
    },
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
  const video = initial ? videoSchema(initial, `/replays/${slug}`) : null;
  return (
    <>
      {initial && (
        <JsonLd
          data={[
            ...(video ? [video] : []),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Webinar Replays", path: "/events" },
              { name: initial.title, path: `/replays/${slug}` },
            ]),
          ]}
        />
      )}
      <ReplayDetailView slug={slug} initial={initial} />
    </>
  );
}
