// ==========================================================================
//  JSON-LD structured-data builders. Keep every value truthful and grounded in
//  real page content — fabricated review/rating markup risks a Google manual
//  action, so rating schema is intentionally omitted until real ratings exist.
//  Entities use stable @id anchors so Google/AI can link them into one graph.
// ==========================================================================
import { SITE } from "./site";
import type { DmsEvent, ArchiveItem } from "./data";
import type { ServerReview } from "./sheets-server";

const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const NAREN_ID = `${SITE.url}/#naren`;
const OG = `${SITE.url}/assets/og-default.jpg`;

const abs = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;

/** Organization — the publishing entity. Referenced by every other node. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: "DMS",
    url: `${SITE.url}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/assets/logo.png`,
    },
    image: OG,
    description:
      "An educational platform offering free, expert-led dental digital marketing education and webinars for dental practice owners.",
    email: SITE.email,
    knowsAbout: [
      "Dental marketing",
      "Patient acquisition",
      "Dental practice growth",
      "Continuing education for dentists",
    ],
    areaServed: ["US", "CA"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "303 Pinetree Way",
      addressLocality: "Mississauga",
      addressRegion: "Ontario",
      postalCode: "L5G 2R4",
      addressCountry: "CA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      areaServed: ["US", "CA"],
      availableLanguage: "English",
    },
    sameAs: Object.values(SITE.social),
  };
}

/** WebSite — enables site-name treatment in search. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    description:
      "Free, expert-led marketing webinars and continuing education for dental practice owners.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/** FAQPage — built from the real on-page FAQ accordion. */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Person — founder; strong E-E-A-T author entity. */
export function narenSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": NAREN_ID,
    name: "Naren Arulrajah",
    jobTitle: "Founder & CEO, Ekwa Marketing",
    description:
      "Digital marketing expert with 15+ years helping dental practice owners attract new patients and grow profitably. Founder of the Dental Marketing Society.",
    worksFor: { "@id": ORG_ID },
    image: `${SITE.url}/assets/naren.jpg`,
    sameAs: [SITE.social.linkedin],
  };
}

/** Event — one online webinar. startDate comes from the ISO field. */
export function eventSchema(event: DmsEvent, pageUrl: string) {
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: abs(pageUrl),
    image: [event.image ? abs(event.image) : OG],
    isAccessibleForFree: true,
    inLanguage: "en",
    location: { "@type": "VirtualLocation", url: abs(pageUrl) },
    organizer: { "@type": "Organization", name: SITE.name, url: `${SITE.url}/` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: abs(event.registerUrl || pageUrl),
      category: "Free",
    },
  };
  if (event.iso) node.startDate = event.iso;
  if (event.panelists?.length) {
    node.performer = event.panelists.map((p) => ({ "@type": "Person", name: p }));
  }
  return node;
}

/** VideoObject — one webinar replay. Only emitted when a valid date exists. */
export function videoSchema(item: ArchiveItem, pageUrl: string): object | null {
  const d = item.date ? new Date(item.date) : null;
  if (!d || isNaN(d.getTime())) return null;
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: item.title,
    description:
      item.summary ||
      `On-demand replay of the Dental Marketing Society webinar: ${item.title}.`,
    thumbnailUrl: [item.image ? abs(item.image) : OG],
    uploadDate: d.toISOString().slice(0, 10),
    url: abs(pageUrl),
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/assets/logo.png` },
    },
    isAccessibleForFree: true,
    inLanguage: "en",
  };
  if (item.vimeo) node.embedUrl = item.vimeo;
  return node;
}

/**
 * Review + AggregateRating — attached to the Organization via the shared @id so
 * the nodes merge into one entity. Built ONLY from real, named, rated reviews
 * pulled from the sheet at build time (placeholders are filtered upstream).
 * Returns null when there are no eligible reviews, so no empty/fake markup ships.
 */
export function reviewsSchema(reviews: ServerReview[]): object | null {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": ORG_ID,
    name: SITE.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      reviewCount: reviews.length,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.text,
      ...(r.date ? { datePublished: r.date } : {}),
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
    })),
  };
}

/** BreadcrumbList — page lineage for breadcrumb rich results. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}
