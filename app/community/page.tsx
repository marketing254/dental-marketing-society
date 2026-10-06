import type { Metadata } from "next";
import { SITE } from "@/lib/site";

// /community has moved to the Dental Member Network's own domain. The site is
// a static export (GitHub Pages can't do server redirects), so this page is a
// meta-refresh + JS redirect. Vercel additionally serves a real 308 redirect
// (see vercel.json). Kept out of the sitemap and marked noindex.
export const metadata: Metadata = {
  title: "Community, The Dental Member Network",
  description:
    "The Dental Member Network has moved to dentalmembernetwork.com. Redirecting you now.",
  robots: { index: false, follow: true },
  alternates: { canonical: SITE.communityUrl },
};

export default function CommunityPage() {
  return (
    <>
      {/* No-JS fallback; React 19 hoists this into <head>. */}
      <meta httpEquiv="refresh" content={`0;url=${SITE.communityUrl}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(SITE.communityUrl)});`,
        }}
      />
      <main className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-mist">Redirecting you to the Dental Member Network…</p>
        <a href={SITE.communityUrl} className="btn-gold btn-lg mt-6">
          Continue to dentalmembernetwork.com
        </a>
      </main>
    </>
  );
}
