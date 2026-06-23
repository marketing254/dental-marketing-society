import type { Metadata } from "next";
import ReviewsView from "@/components/views/ReviewsView";
import JsonLd from "@/components/JsonLd";
import { reviewsSchema, breadcrumbSchema } from "@/lib/schema";
import { fetchReviewsServer } from "@/lib/sheets-server";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What dental practice owners, dentists, and teams say about Dental Marketing Society webinars and the team behind them.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const reviews = await fetchReviewsServer();
  const schema = reviewsSchema(reviews);
  return (
    <>
      <JsonLd
        data={[
          ...(schema ? [schema] : []),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/reviews" },
          ]),
        ]}
      />
      <ReviewsView />
    </>
  );
}
