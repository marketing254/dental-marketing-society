import type { Metadata } from "next";
import HomeView from "@/components/views/HomeView";

export const metadata: Metadata = {
  title: "Dental Marketing Society, Marketing Webinars For Dental Practice Owners",
  description:
    "Free, expert-led marketing webinars for dental practice owners. Fill your calendar with new patients, sharpen your marketing, and earn free CE credits live.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
