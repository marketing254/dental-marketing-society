# Dental Marketing Society — Next.js

A first-class, 3D-accented rebuild of the Dental Marketing Society site in **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript**, with a **React Three Fiber** hero scene and **Framer Motion** scroll animations. All original content, pages, SEO, and the live Google Sheets data layer are preserved.

## Run

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # production build
    npm start        # serve the production build

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
- **components/three/** — the lazy-loaded WebGL hero (`ssr: false`, decorative, never blocks SSR or SEO).
- **components/motion/** — `Reveal` (scroll-in) and `TiltCard` (3D hover tilt).
- **lib/sheets.ts** — live Google Sheets (gviz) data layer + `useSheet` hook, faithful port of the original `sheets.js`.
- **lib/site.ts** — single source of truth for contact info / social links.
- **lib/data.ts** — static fallback content (events, speakers, reviews, archive, FAQ).

## Forms / leads

Forms POST to a Google Apps Script web app. Copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_DMS_APPS_SCRIPT_URL` to the deployed `/exec` URL. Without it, forms still show the
success state but no lead is sent (graceful degrade — same behaviour as the original site).
