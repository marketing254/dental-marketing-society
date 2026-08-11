import type { Metadata } from "next";
import SpeakersView from "@/components/views/SpeakersView";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { fetchSheetServer, pickRow } from "@/lib/sheets-server";
import { SPEAKERS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet the dental marketing leaders, practice owners, and growth specialists who speak on Dental Marketing Society webinars.",
  alternates: { canonical: "/speakers" },
};

export default async function SpeakersPage() {
  // Person entities for the speaker roster (E-E-A-T / entity signals). Built
  // from the live sheet at build time, falling back to the static roster.
  const rows = await fetchSheetServer("featured_partners");
  const fromSheet = rows
    .filter((r) => pickRow(r, ["name"]))
    .map((r) => ({
      name: pickRow(r, ["name"]),
      role: pickRow(r, ["role", "title", "position"]),
      bio: pickRow(r, ["bio", "about"]),
    }));
  const speakers = fromSheet.length
    ? fromSheet
    : SPEAKERS.map((s) => ({ name: s.name, role: s.role, bio: s.bio || "" }));
  const personList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dental Marketing Society webinar speakers",
    itemListElement: speakers.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: s.name,
        ...(s.role ? { jobTitle: s.role } : {}),
        ...(s.bio ? { description: s.bio } : {}),
      },
    })),
  };
  return (
    <>
      <JsonLd
        data={[
          personList,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Speakers", path: "/speakers" },
          ]),
        ]}
      />
      <SpeakersView />
    </>
  );
}
