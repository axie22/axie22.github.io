import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    // Certification badges are served from Credly's CDN.
    remotePatterns: [{ protocol: "https", hostname: "images.credly.com" }],
  },
};

export default nextConfig;
