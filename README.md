# Dental Marketing Society — Next.js

A first-class, 3D-accented rebuild of the Dental Marketing Society site in **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript**, with a **React Three Fiber** hero scene and **Framer Motion** scroll animations. All original content, pages, SEO, and the live Google Sheets data layer are preserved.

## Run

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # static export -> ./out

The project is configured for **static export** (`output: "export"`), so `npm run build`
produces a fully static site in `./out` that can be served by any static host.

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes automatically.

1. Create a GitHub repo and push this folder:

       git init
       git add -A
       git commit -m "Initial commit"
       git branch -M main
       git remote add origin https://github.com/<you>/<repo>.git
       git push -u origin main

2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` deploys. The site URL appears in the Actions run and under Settings → Pages.

**Base path** is handled automatically: on a project repo the site is served under
`/<repo>` (derived from `GITHUB_REPOSITORY` in CI); on a `*.github.io` user site or a custom
domain no base path is added. Override anytime with `NEXT_PUBLIC_BASE_PATH` (set it to `""`
to force the root). For a custom domain, add a `CNAME` file in `public/`.

> Note: the live Google Sheets content and the form/scheduler/map embeds are all client-side,
> so they work the same on a static host.

## Pages

| Route        | Page                                                     |
|--------------|----------------------------------------------------------|
| `/`          | Home — 3D hero, services, events, speakers, reviews, FAQ |
| `/about`     | About / founder story / team                             |
| `/events`    | Upcoming webinars + gated replay archive                 |
| `/audit`     | Complimentary practice audit + scheduler embed           |
| `/contact`   | Contact form + map                                       |
| `/speaker`   | Speaker application                                      |
| `/resources` | Coming-soon resource library                             |

Plus generated `sitemap.xml`, `robots.txt`, Open Graph/Twitter metadata, and Organization JSON-LD.

## Architecture

- **app/** — one route per page; each is a thin server component (for metadata/SEO) that renders a client `*View` from `components/views/`.
- **components/three/** — the lazy-loaded WebGL hero orb (`ssr: false`, decorative, never blocks SSR or SEO).
- **components/motion/** — `Reveal` (scroll-in), `TiltCard` (3D hover tilt), `BeamField` (calm inner-page backdrop), `CountUp` (scroll-triggered number animation).
- **components/HeroShowcase.tsx / EventCover.tsx** — the home growth-dashboard visual and the custom-designed webinar covers.
- **lib/sheets.ts** — live Google Sheets (gviz) data layer + `useSheet` hook, faithful port of the original `sheets.js`.
- **lib/site.ts** — single source of truth for contact info / social links.
- **lib/data.ts** — static fallback content (events, speakers, reviews, archive, FAQ).

## Forms / leads

Forms POST to a Google Apps Script web app. Copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_DMS_APPS_SCRIPT_URL` to the deployed `/exec` URL. Without it, forms still show the
success state but no lead is sent (graceful degrade — same behaviour as the original site).
