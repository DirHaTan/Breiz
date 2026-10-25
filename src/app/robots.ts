import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// robots.txt: search engines may read the site, except the editor and account pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/auth", "/kont", "/fr/compte", "/moderation", "/fr/moderation"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
