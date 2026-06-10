import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Dental Marketing Society, Marketing Webinars For Dental Practice Owners",
    template: "%s, Dental Marketing Society",
  },
  description:
    "Free, expert-led marketing webinars for dental practice owners. Fill your calendar with new patients, sharpen your marketing, and earn free CE credits live.",
  icons: { icon: "/assets/logo.png" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    images: ["/assets/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#04090f",
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/assets/logo.png`,
  description:
    "An educational platform offering the best in dental digital marketing education for dental practice owners.",
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "303 Pinetree Way",
    addressLocality: "Mississauga",
    addressRegion: "Ontario",
    postalCode: "L5G 2R4",
    addressCountry: "CA",
  },
  sameAs: Object.values(SITE.social),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
