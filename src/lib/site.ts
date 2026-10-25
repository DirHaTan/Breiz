// The site's public address, used for links shared outside the site
// (social previews, canonical links, sitemap, sign-in emails).
// Set NEXT_PUBLIC_SITE_URL in Vercel; the official address is the fallback.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.keleierbreiz.fr").replace(/\/+$/, "");
