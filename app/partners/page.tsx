import type { Metadata } from "next";
import PartnersView from "@/components/views/PartnersView";

export const metadata: Metadata = {
  title: "Featured Partners",
  description:
    "The dental publications, technology providers, and organizations that partner with the Dental Marketing Society.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return <PartnersView />;
}
