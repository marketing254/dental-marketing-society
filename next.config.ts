import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * CURRENT: served at the project URL
 *   https://marketing254.github.io/dental-marketing-society/
 * so every asset needs the "/dental-marketing-society" base path (this MUST
 * match the GitHub repo name). Default for production builds (dev stays at root).
 *
 * WHEN THE CUSTOM DOMAIN GOES LIVE (www.dentalmarketingsociety.com, served at
 * root): set REPO_BASE to "" below (or NEXT_PUBLIC_BASE_PATH=""), set
 * lib/asset.ts to match, and re-create public/CNAME with the domain.
 */
const REPO_BASE = "/dental-marketing-society";
// Vercel serves at the domain root → no base path. GitHub Pages serves at
// /<repo> → needs REPO_BASE. Auto-detected via Vercel's VERCEL=1 build env, with
// NEXT_PUBLIC_BASE_PATH as a manual override for either host.
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : process.env.VERCEL
      ? ""
      : process.env.NODE_ENV === "production"
        ? REPO_BASE
        : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  basePath: basePath || undefined,
  trailingSlash: true,
  // Propagate the resolved base path into the client bundle so asset() (used for
  // <Image> src under static export) prefixes correctly on whichever host built.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
