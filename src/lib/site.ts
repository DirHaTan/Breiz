// The site's public address, used for links shared outside the site
// (social previews, canonical links, sitemap, sign-in emails).
// Set NEXT_PUBLIC_SITE_URL in Vercel; the official address is the fallback.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.keleierbreiz.fr").replace(/\/+$/, "");

// The picture shown when the homepage, a section or an article without its own
// picture is shared on Facebook, X and others (public/og-default.jpg).
export const DEFAULT_SHARE_IMAGE = {
  url: "/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Keleier Breiz hag ar Bed",
};
