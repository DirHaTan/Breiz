import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Article images are served by Sanity's image service.
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
