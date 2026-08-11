import type { Metadata } from "next";
import ResourcesView from "@/components/views/ResourcesView";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { RESOURCES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Dental Marketing Resources: Guides, Templates & Checklists",
  description:
    "Download free dental marketing resources from the Dental Marketing Society — practical guides, consultation scripts, ROI audit checklists, and growth templates for practice owners.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free dental marketing resources",
    itemListElement: RESOURCES.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: r.title,
        description: r.description,
        ...(r.author ? { author: { "@type": "Person", name: r.author } } : {}),
        isAccessibleForFree: true,
      },
    })),
  };
  return (
    <>
      <JsonLd
        data={[
          itemList,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
          ]),
        ]}
      />
      <ResourcesView />
    </>
  );
}
