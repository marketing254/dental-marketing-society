import type { Metadata } from "next";
import ReviewsView from "@/components/views/ReviewsView";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What dental practice owners, dentists, and teams say about Dental Marketing Society webinars and the team behind them.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return <ReviewsView />;
}
