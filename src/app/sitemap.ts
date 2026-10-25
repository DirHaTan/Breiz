import type { MetadataRoute } from "next";
import { announcePath, legalPath, localePath, locales, subscribePath } from "@/i18n/config";
import { sections } from "@/lib/sections";
import { departmentPath, departments, DEPARTMENT_SECTION } from "@/lib/departments";
import { articlePath, getLatestArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

// sitemap.xml: every public page, in both languages, for search engines.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    const articles = await getLatestArticles(lang);
    entries.push({ url: url(localePath(lang)), changeFrequency: "daily", priority: 1 });
    for (const s of sections) entries.push({ url: url(localePath(lang, `/${s[lang].slug}`)), changeFrequency: "daily" });
    // Only departments that have an online article (the others aren't linked anywhere).
    for (const d of departments) {
      if (articles.some((a) => a.section === DEPARTMENT_SECTION && a.department === d.id)) {
        entries.push({ url: url(departmentPath(lang, d)) });
      }
    }
    for (const path of [subscribePath(lang), announcePath(lang), legalPath("notices", lang), legalPath("privacy", lang)]) {
      entries.push({ url: url(path), changeFrequency: "monthly", priority: 0.3 });
    }
    for (const a of articles) entries.push({ url: url(articlePath(a)), lastModified: a.date, priority: 0.8 });
  }
  return entries;
}
