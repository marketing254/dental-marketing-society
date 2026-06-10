import type { Metadata } from "next";
import EventsView from "@/components/views/EventsView";

export const metadata: Metadata = {
  title: "Webinars & Events",
  description:
    "Upcoming live webinars plus our full webinar archive. Enter your name and email to unlock free replays of past dental marketing webinars.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return <EventsView />;
}
