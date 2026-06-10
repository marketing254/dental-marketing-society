import type { Metadata } from "next";
import SpeakerView from "@/components/views/SpeakerView";

export const metadata: Metadata = {
  title: "Sign Up as a Speaker",
  description:
    "Share your expertise with dental practice owners. Apply to speak on a Dental Marketing Society webinar and reach an engaged audience of dentists.",
  alternates: { canonical: "/speaker" },
};

export default function SpeakerPage() {
  return <SpeakerView />;
}
