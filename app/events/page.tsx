import type { Metadata } from "next";
import EventsView from "@/components/views/EventsView";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, eventSchema } from "@/lib/schema";
import { fetchSheetServer, pickRow, normalizeWebinarRow } from "@/lib/sheets-server";
import { slugify } from "@/lib/slug";
import { UPCOMING_EVENTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Webinars & Events",
  description:
    "Upcoming live webinars plus our full webinar archive. Enter your name and email to unlock free replays of past dental marketing webinars.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const rows = await fetchSheetServer("webinars");
  const fromSheet = rows.filter((r) => pickRow(r, ["title"])).map(normalizeWebinarRow);
  const events = fromSheet.length ? fromSheet : UPCOMING_EVENTS;
  // Only genuinely upcoming sessions carry Event markup — expired events with
  // EventScheduled status risk a Search Console "expired event" flag.
  const upcoming = events.filter((e) => e.iso && new Date(e.iso).getTime() > Date.now());
  const itemList =
    upcoming.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Upcoming Dental Marketing Society webinars",
          itemListElement: upcoming.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: eventSchema(e, `/webinars/${slugify(e.title)}`),
          })),
        }
      : null;
  return (
    <>
      <JsonLd
        data={[
          ...(itemList ? [itemList] : []),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Webinars & Events", path: "/events" },
          ]),
        ]}
      />
      <EventsView />
    </>
  );
}
