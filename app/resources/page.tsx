import type { Metadata } from "next";
import ResourcesView from "@/components/views/ResourcesView";

export const metadata: Metadata = {
  title: "Resources, Coming Soon",
  description:
    "Our resource library, blog & insights, free downloads, practice tools, and a podcast, is coming soon. Be the first to know when it launches.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
