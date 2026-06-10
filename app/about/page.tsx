import type { Metadata } from "next";
import AboutView from "@/components/views/AboutView";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Dental Marketing Society is an educational platform offering the best in dental digital marketing education, founded by Naren Arulrajah, Founder/CEO of Ekwa Marketing.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
