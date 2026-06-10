import type { Metadata } from "next";
import ContactView from "@/components/views/ContactView";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Dental Marketing Society. Email team@dentalmarketingsociety.com or send us a message, we'd love to hear from you.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
