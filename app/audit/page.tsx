import type { Metadata } from "next";
import AuditView from "@/components/views/AuditView";

export const metadata: Metadata = {
  title: "Complimentary Practice Audit Session",
  description:
    "Book your free 45-minute Practice Growth Audit ($900 value). Get a custom growth roadmap for your dental practice. No credit card, no obligation.",
  alternates: { canonical: "/audit" },
};

export default function AuditPage() {
  return <AuditView />;
}
