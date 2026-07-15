import type { Metadata } from "next";
import ResourcesView from "@/components/views/ResourcesView";

export const metadata: Metadata = {
  title: "Free Dental Marketing Resources: Guides, Templates & Checklists",
  description:
    "Download free dental marketing resources from the Dental Marketing Society — practical guides, consultation scripts, ROI audit checklists, and growth templates for practice owners.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
