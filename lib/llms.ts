// Build-time content for /llms.txt and /llms-full.txt — the machine-readable
// entry points for AI systems (ChatGPT, Claude, Perplexity, Gemini). Generated
// from the live sheet at build so new webinars/replays/resources appear on the
// next deploy without manual edits. Keep every claim truthful and consistent
// with the honesty rules used on-page (free, PACE CE, no invented numbers).
import { SITE } from "./site";
import {
  fetchSheetServer,
  pickRow,
  normalizeReplayRow,
  normalizeWebinarRow,
} from "./sheets-server";
import { slugify } from "./slug";
import { ARCHIVE, UPCOMING_EVENTS, FAQS, TEAM, RESOURCES } from "./data";

const U = (path: string) => `${SITE.url}${path.endsWith("/") ? path : `${path}/`}`;

export async function getReplays() {
  const rows = await fetchSheetServer("webinar-replays");
  const fromSheet = rows
    .filter((r) => pickRow(r, ["title"]))
    .map((r) => normalizeReplayRow(r));
  const seen = new Set(fromSheet.map((r) => r.slug));
  const merged = [...fromSheet, ...ARCHIVE.filter((r) => !seen.has(r.slug))];
  return merged.sort(
    (a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0)
  );
}

export async function getWebinars() {
  const rows = await fetchSheetServer("webinars");
  const fromSheet = rows
    .filter((r) => pickRow(r, ["title"]))
    .map((r) => normalizeWebinarRow(r));
  return fromSheet.length ? fromSheet : UPCOMING_EVENTS;
}

export async function getFaqs() {
  const rows = await fetchSheetServer("faqs");
  const fromSheet = rows
    .filter((r) => pickRow(r, ["question"]))
    .map((r) => ({ question: pickRow(r, ["question"]), answer: pickRow(r, ["answer"]) }));
  return fromSheet.length ? fromSheet : FAQS;
}

export async function buildLlmsTxt(): Promise<string> {
  const replays = await getReplays();
  const lines = [
    `# Dental Marketing Society`,
    ``,
    `> The Dental Marketing Society (DMS) is a free educational platform that hosts expert-led marketing webinars and continuing education for dental practice owners. Every webinar is 100% free, includes 2 free CE credits for live attendance (PACE-accredited), and is available on demand as a replay. Founded by Naren Arulrajah, Founder & CEO of Ekwa Marketing.`,
    ``,
    `## What DMS offers`,
    ``,
    `- **Free live webinars** for dentists and practice teams on dental marketing, patient acquisition, leadership, systems, and practice finance.`,
    `- **Free CE credits**: attend live to earn 2 continuing-education credits per webinar via a PACE-accredited platform.`,
    `- **On-demand replays**: every registrant receives the replay; the full archive is browsable.`,
    `- **Free resource library**: downloadable guides, templates, and checklists for practice growth.`,
    `- **Complimentary Practice Audit Session**: a free 45-minute one-on-one growth session ($900 value) with a custom growth roadmap.`,
    ``,
    `## Key facts`,
    ``,
    `- Cost: Free for all webinars, replays, CE credits, and resources.`,
    `- Audience: Dental practice owners, dentists, office managers, and dental team members.`,
    `- Format: Live online webinars (typically evenings ET) plus on-demand replays.`,
    `- Region served: United States and Canada.`,
    ``,
    `## Pages`,
    ``,
    `- Home: ${U("/")}`,
    `- About: ${U("/about")}`,
    `- Webinars & Events: ${U("/events")}`,
    `- Speakers: ${U("/speakers")}`,
    `- Reviews: ${U("/reviews")}`,
    `- Featured Partners: ${U("/partners")}`,
    `- Free Resource Library: ${U("/resources")}`,
    `- Community (Dental Member Network): ${U("/community")}`,
    `- Free Practice Audit: ${U("/msm")}`,
    `- Apply to Speak: ${U("/speaker")}`,
    `- Contact: ${U("/contact")}`,
    ``,
    `## Webinar replays`,
    ``,
    ...replays.map((r) => `- ${r.title}${r.date ? ` (${r.date})` : ""}: ${U(`/replays/${r.slug}`)}`),
    ``,
    `## Contact`,
    ``,
    `- Email: ${SITE.email}`,
    `- Sitemap: ${SITE.url}/sitemap.xml`,
    `- Full text version: ${SITE.url}/llms-full.txt`,
    ``,
  ];
  return lines.join("\n");
}

export async function buildLlmsFullTxt(): Promise<string> {
  const [replays, webinars, faqs] = await Promise.all([
    getReplays(),
    getWebinars(),
    getFaqs(),
  ]);
  const lines = [
    `# Dental Marketing Society — full reference`,
    ``,
    `> Complete plain-text reference for AI systems. The Dental Marketing Society (DMS) is a free educational platform for dental practice owners: expert-led live marketing webinars with 2 free PACE-accredited CE credits per session, an on-demand replay archive, a free resource library, and a complimentary one-on-one practice audit. United States and Canada. Everything is free.`,
    ``,
    `## About the Dental Marketing Society`,
    ``,
    `The Dental Marketing Society was founded by Naren Arulrajah, Founder & CEO of Ekwa Marketing, a digital marketing agency serving dental practices for more than 15 years. Naren also founded Thriving Practice Academy and iLoveDentistry, and co-hosts the Less Insurance Dependence podcast. DMS exists to give dental practice owners practical, expert-led marketing education without cost: live webinars, CE credits, replays, and downloadable tools.`,
    ``,
    `The team includes ${TEAM.map((t) => `${t.name} (${t.role})`).join(", ")}.`,
    ``,
    `## Frequently asked questions`,
    ``,
    ...faqs.flatMap((f) => [`### ${f.question}`, ``, f.answer, ``]),
    `## Upcoming webinars`,
    ``,
    ...webinars.flatMap((e) => [
      `### ${e.title}`,
      ``,
      [
        e.dateLabel ? `Date: ${e.dateLabel}${e.time ? `, ${e.time}` : ""}.` : "",
        e.ceCredits ? `CE: ${e.ceCredits} for live attendance.` : "",
        e.description || "",
        `Free registration: ${U("/events")}`,
      ]
        .filter(Boolean)
        .join(" "),
      ``,
    ]),
    `## Webinar replay archive`,
    ``,
    ...replays.flatMap((r) => [
      `### ${r.title}`,
      ``,
      [
        r.date ? `Recorded: ${r.date}.` : "",
        r.category ? `Topic: ${r.category}.` : "",
        r.summary || r.subtitle || "",
        `Watch free: ${U(`/replays/${r.slug}`)}`,
      ]
        .filter(Boolean)
        .join(" "),
      ``,
    ]),
    `## Free resource library`,
    ``,
    ...RESOURCES.map(
      (r) => `- ${r.title} (${r.category}${r.author ? `, by ${r.author}` : ""}): ${r.description}`
    ),
    ``,
    `Download free at ${U("/resources")}`,
    ``,
    `## Complimentary Practice Audit Session`,
    ``,
    `A free 45-minute, one-on-one growth session ($900 value). The DMS team does 4-5 hours of research on the practice beforehand and the owner walks away with a custom growth roadmap that is theirs to keep. No credit card, no obligation. Details: ${U("/msm")}`,
    ``,
    `## Contact`,
    ``,
    `- Email: ${SITE.email}`,
    `- Website: ${SITE.url}/`,
    `- Address: 303 Pinetree Way, Mississauga, Ontario, L5G 2R4, Canada`,
    ``,
  ];
  return lines.join("\n");
}

export { slugify };
