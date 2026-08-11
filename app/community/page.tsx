import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import CommunityInteractions from "@/components/community/CommunityInteractions";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Community, The Dental Member Network",
  description:
    "The Dental Member Network, from the team behind Dental Marketing Society. Bring any practice problem in plain English and a real person writes back a plan within 2 to 3 business days.",
  alternates: { canonical: "/community" },
};

// The page body is the self-contained Member Network landing page (fonts and
// images embedded), rebranded for DMS per the rollout addendum and rebuilt by
// scripts into content/. It is read at build time so none of it ships in the
// client JS bundle; the site layout supplies the real navbar and footer.
export default function CommunityPage() {
  const dir = path.join(process.cwd(), "content");
  const css = fs.readFileSync(path.join(dir, "community.css"), "utf8");
  const body = fs.readFileSync(path.join(dir, "community-body.html"), "utf8");
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Community", path: "/community" },
          ]),
        ]}
      />
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="dmn" dangerouslySetInnerHTML={{ __html: body }} />
      <CommunityInteractions />
    </>
  );
}
