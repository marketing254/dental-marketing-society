import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";
import { organizationSchema, websiteSchema } from "@/lib/schema";
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
  icons: { icon: asset("/assets/logo.png") },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    images: [{ url: "/assets/og-default.jpg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport = {
  themeColor: "#04090f",
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
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
