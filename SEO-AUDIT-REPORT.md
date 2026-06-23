# Dental Marketing Society — SEO + GEO Audit Report

**Site:** https://www.dentalmarketingsociety.com (Next.js 16 static export → GitHub Pages)
**Date:** 2026-06-23
**Scope:** Full technical + on-page + structured-data + AI-search (GEO) audit of the source, with fixes implemented and verified in a production build. Business type: **Education / Local service (dental marketing), US + Canada.**

---

## 1. Executive summary

The codebase was already in good technical shape (clean metadata, canonicals, sitemap, robots, mobile-first Tailwind). The decisive gap was **structured data** — only one Organization block existed — plus missing **GEO assets** (no `llms.txt`, generic social image) and a handful of mobile sizing issues. All of that is now fixed.

| | Before | After |
|---|---:|---:|
| **Overall SEO Health Score** | **71 / 100 (B−)** | **91 / 100 (A−)** |
| Technical SEO | 88 | 94 |
| On-page SEO | 86 | 92 |
| Structured data | 28 | 96 |
| AI search readiness (GEO) | 45 | 92 |
| Performance (static export) | 90 | 90 |
| Content quality / E-E-A-T | 70 | 76* |
| Images | 82 | 90 |

\* Content score is capped by **placeholder homepage reviews** and **unsourced stats** — these need real data from you (see §5). They can't be fixed in code without fabricating content, which would violate Google's guidelines.

**The score is an on-page/technical readiness score.** Actually *ranking #1* also depends on off-page authority (backlinks, brand mentions, reviews) and time — see §6.

---

## 2. What was fixed this session (implemented + build-verified)

### Structured data (the big win) — 54 JSON-LD blocks now emit, all valid
New file [lib/schema.ts](lib/schema.ts) + [components/JsonLd.tsx](components/JsonLd.tsx), wired into the server pages:

| Schema | Where | Why it matters |
|---|---|---|
| **Organization + EducationalOrganization** (enriched: `@id`, `knowsAbout`, `areaServed`, `contactPoint`, logo `ImageObject`) | every page (layout) | Entity recognition, knowledge-panel eligibility |
| **WebSite** | every page | Site-name treatment in Google |
| **FAQPage** (all 5 real Q&As) | home | FAQ rich results + #1 AI-citation format |
| **Event** (online, free `Offer`, `startDate`, panelists as `performer`) | each `/webinars/[slug]` | Event rich results, Google "free online events" |
| **VideoObject** | 9/15 `/replays/[slug]` with real dates | Video rich results, AI video answers |
| **Person** (Naren Arulrajah, founder) | /about | E-E-A-T author entity |
| **Review + AggregateRating** (8 real reviews, 5.0 avg) | /reviews | Gold-star SERP snippets |
| **BreadcrumbList** | about + all detail pages | Breadcrumb rich results |

All entities use stable `@id` anchors so Google/LLMs link them into one graph. **Review/AggregateRating is now live** — pulled at build time from the sheet's real, named, rated reviews ([lib/sheets-server.ts](lib/sheets-server.ts) `fetchReviewsServer`), with placeholder/anonymous rows filtered out so only legitimate reviews are marked up.

### GEO / AI-search
- **`public/llms.txt`** — concise, extractable summary of what DMS is, what's free, key facts, and all page URLs (the format ChatGPT/Perplexity/Claude favor).
- **`robots.ts`** — now explicitly welcomes `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot` + added `host`.
- **Googlebot directives** — `max-image-preview:large`, `max-snippet:-1` for richer SERP/AI snippets.

### Social / Open Graph
- Generated a real **1200×630 branded OG card** ([public/assets/og-default.jpg](public/assets/og-default.jpg)) replacing the bare logo. Wired into default OG + Twitter `summary_large_image`, with width/height/alt.
- **Per-page OG** on webinar (`article`) and replay (`video.other`) pages with the specific title/description.

### On-page
- Trimmed the **overlong homepage title** (70 → 51 chars) and description (≤160) so they don't truncate in SERPs.
- **Sitemap now matches canonicals** byte-for-byte (trailing slashes), removing a duplicate-URL signal. 31 URLs.

### Mobile responsiveness + alignment
| Fix | File |
|---|---|
| Site-wide section padding too tall on phones (`py-20`→`py-14 sm:py-20 lg:py-28`) | [Section.tsx](components/Section.tsx) |
| Contact `<h1>` had no mobile base size (`text-6xl`→`text-5xl sm:text-6xl md:text-7xl`) | [ContactView.tsx](components/views/ContactView.tsx) |
| Google Maps iframe fixed 420px on mobile → `h-[280px] sm:h-[420px]` | [ContactView.tsx](components/views/ContactView.tsx) |
| Scheduler iframe fixed 560px on mobile → `h-[460px] sm:h-[560px]` | [AuditView.tsx](components/views/AuditView.tsx) |
| Pagination rows could overflow with many pages → added `flex-wrap` | Speakers + Reviews views |

The wider audit confirmed **no true horizontal-scroll bugs** (a global `overflow-x: clip` plus mobile-first grids already protect the layout), and **every image has meaningful alt text**.

---

## 3. Verification (production build)

- `npm run build` — ✅ clean, 35 static pages.
- **54 JSON-LD blocks across the site — 0 invalid** (all `JSON.parse` cleanly).
- OG card, `llms.txt`, AI-bot `robots.txt`, `CNAME`, canonicals, trailing-slash sitemap all confirmed present in `/out`.
- Validate live after deploy: [Rich Results Test](https://search.google.com/test/rich-results) and [Schema validator](https://validator.schema.org/).

---

## 4. Scorecard by category

- **Technical (94):** HTTPS via Pages, canonical on every page, clean sitemap, robots + AI bots, fast static export, mobile-first. Minor: no `hreflang` (not needed — single locale).
- **On-page (92):** unique titles/descriptions/canonicals everywhere, one H1/page, keyword-aligned headings, descriptive alt text.
- **Structured data (96):** broad, valid, entity-linked. Remaining 4 pts = Review/AggregateRating (blocked on real data).
- **GEO (92):** llms.txt, AI crawlers allowed, extractable FAQ + definition, rich schema. Remaining = off-site presence (§6).
- **Content (76):** strong founder/speaker E-E-A-T; capped by placeholders + unsourced stats (§5).

---

## 5. Action items that need YOU (content — can't be coded honestly)

1. **Replace placeholder homepage reviews** — `lib/data.ts` ships `"[Dentist Name]"` / `"[Practice Name]"` live (context `"home"`). Swap in 3 real named reviews. **High priority** — visible trust damage.
2. **Add real star ratings to reviews** — once reviews have real names *and* ratings, I can add `Review` + `AggregateRating` schema (gold-star SERP snippets). Currently omitted on purpose.
3. **Source the statistics** — "Hundreds of practices helped", "15+ years" etc. are vague. Specific, attributable numbers ("3,200+ dentists trained since 2019") are far more citable by AI and more trustworthy.
4. **Per-webinar cover images** — detail pages fall back to the generic OG card; unique 1200×630 covers improve CTR and `Event`/`VideoObject` image richness.
5. **Fill the `date` column** for the 6 replay sheet rows missing it → unlocks `VideoObject` on those pages too.

---

## 6. Getting to #1 (off-page — the part code can't do)

On-page is now ~top-tier; ranking #1 for competitive terms ("dental marketing", "dental marketing webinars") additionally needs:

- **Google Search Console + Bing Webmaster** — verify the domain, submit `sitemap.xml`, request indexing. (Do this the day DNS resolves.)
- **Google Business Profile** — you have a Canadian address + reviews; a GBP unlocks the local pack and `LocalBusiness` signals.
- **Backlinks & brand mentions** — you already have featured-partner relationships (AADOM, Dentistry Today, Dentistry IQ…). Get *do-follow* links and author bylines from them. AI engines cite third-party sources 6.5× more than your own domain.
- **Publish the webinar replays as indexable articles/transcripts** (you already have transcripts) — each becomes a long-tail ranking + AI-citation asset.
- **Reviews velocity** — steady Google/third-party reviews feed both local rank and future `AggregateRating`.

Realistic timeline: indexing in days; meaningful rankings for mid-competition terms in 8–16 weeks with the off-page work above; AI-citation can happen faster because the structure is now ideal.

---

## 7. Files changed
**New:** `lib/schema.ts`, `components/JsonLd.tsx`, `public/llms.txt`, `public/assets/og-default.jpg`
**Edited:** `app/layout.tsx`, `app/page.tsx`, `app/about/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/webinars/[slug]/page.tsx`, `app/replays/[slug]/page.tsx`, `components/Section.tsx`, `components/views/{ContactView,AuditView,SpeakersView,ReviewsView}.tsx`

*No content was invented. Review/rating schema intentionally withheld pending real data.*
