import type { Metadata } from "next";
import SpeakersView from "@/components/views/SpeakersView";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet the dental marketing leaders, practice owners, and growth specialists who speak on Dental Marketing Society webinars.",
  alternates: { canonical: "/speakers" },
};

export default function SpeakersPage() {
  return <SpeakersView />;
}
