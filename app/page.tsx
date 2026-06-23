import type { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { FAQS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dental Marketing Society: Free Webinars for Dentists",
  description:
    "Free, expert-led marketing webinars for dental practice owners. Attract new patients, sharpen your marketing, and earn free CE credits live.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQS)} />
      <HomeView />
    </>
  );
}
