import type { NextConfig } from "next";

/**
 * Static export so the site can be hosted on GitHub Pages (or any static host).
 *
 * basePath/assetPrefix:
 *  - On a *project* repo, GitHub Pages serves the site under /<repo-name>, so we
 *    derive the base path from GITHUB_REPOSITORY automatically in CI.
 *  - On a *user/org* site (<name>.github.io) or a custom domain, no base path is
 *    needed — that's detected, and you can always override with
 *    NEXT_PUBLIC_BASE_PATH (set it to "" to force the root).
 */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repo.endsWith(".github.io");
const inferredBase =
  process.env.GITHUB_ACTIONS && repo && !isUserSite ? `/${repo}` : "";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : inferredBase;

const nextConfig: NextConfig = {
  output: "export",
  // next/image can't optimize on a static host.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Emit /about/index.html etc. so GitHub Pages serves clean URLs.
  trailingSlash: true,
};

export default nextConfig;
