import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Article images are served by Sanity's image service.
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
  // French legal pages live under /fr; the short addresses lead there too.
  async redirects() {
    return [
      { source: "/mentions-legales", destination: "/fr/mentions-legales", permanent: true },
      { source: "/confidentialite", destination: "/fr/confidentialite", permanent: true },
    ];
  },
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
