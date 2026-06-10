import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sheet-driven content can reference Google Drive-hosted images.
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
