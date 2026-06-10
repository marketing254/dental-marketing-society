import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages, served straight from the `main` branch's
 * `/docs` folder (Settings → Pages → Deploy from a branch → main → /docs).
 *
 * The repo is a *project* site, so it's published under
 *   https://marketing254.github.io/dental-marketing-society/
 * which means every asset needs the "/dental-marketing-society" base path.
 * That's applied for production builds only, so `npm run dev` stays at the root.
 * Override with NEXT_PUBLIC_BASE_PATH if you rename the repo or use a domain.
 */
const REPO_BASE = "/dental-marketing-society";
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
