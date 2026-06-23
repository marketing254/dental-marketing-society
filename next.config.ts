import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * CURRENT: served at the project URL
 *   https://marketing254.github.io/msm/
 * so every asset needs the "/msm" base path (must match the GitHub repo name).
 * This is the default for production builds (dev stays at root).
 *
 * WHEN THE CUSTOM DOMAIN GOES LIVE (www.dentalmarketingsociety.com, served at
 * root): set REPO_BASE to "" below (or NEXT_PUBLIC_BASE_PATH=""), set
 * lib/asset.ts to match, and re-create public/CNAME with the domain.
 */
const REPO_BASE = "/msm";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
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
};

export default nextConfig;
