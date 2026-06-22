import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The site is served from the custom domain www.dentalmarketingsociety.com,
 * which is published at the *root* — so there is NO base path (assets resolve
 * from "/"). The custom domain is pinned by public/CNAME.
 *
 * If you ever revert to the bare project URL
 *   https://marketing254.github.io/dental-marketing-society/
 * set NEXT_PUBLIC_BASE_PATH="/dental-marketing-society" for the build.
 */
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
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
