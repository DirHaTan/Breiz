import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/config";
import { getSection, type SectionId } from "@/lib/sections";
import sampleArticles from "@/content/sample-articles.json";

// For now the articles come from a sample file. In Step 2 these functions
// will read from Sanity instead, and the rest of the site won't need to change.

type ArticleText = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
};

export type Article = {
  id: string;
  section: SectionId;
  author: string;
  date: string;
  br?: ArticleText;
  fr?: ArticleText;
};

// One article seen in a single language.
export type LocalizedArticle = ArticleText & {
  id: string;
  lang: Locale;
  section: SectionId;
  author: string;
  date: string;
};

const articles = (sampleArticles as Article[]).toSorted((a, b) =>
  b.date.localeCompare(a.date),
);

function localize(article: Article, lang: Locale): LocalizedArticle | undefined {
  const text = article[lang];
  if (!text) return undefined;
  return { ...text, id: article.id, lang, section: article.section, author: article.author, date: article.date };
}

export async function getLatestArticles(lang: Locale, limit?: number) {
  const list = articles.flatMap((a) => localize(a, lang) ?? []);
  return limit ? list.slice(0, limit) : list;
}

export async function getArticlesBySection(lang: Locale, section: SectionId) {
  return articles
    .filter((a) => a.section === section)
    .flatMap((a) => localize(a, lang) ?? []);
}

export async function getArticle(lang: Locale, section: SectionId, slug: string) {
  const article = articles.find((a) => a.section === section && a[lang]?.slug === slug);
  return article && localize(article, lang);
}

// The same article in the other language, if it has been translated.
export async function getTranslation(id: string, lang: Locale) {
  const article = articles.find((a) => a.id === id);
  return article && localize(article, lang);
}

export async function getAllArticles() {
  return articles;
}

export function articlePath(article: LocalizedArticle): string {
  const section = getSection(article.section)!;
  return localePath(article.lang, `/${section[article.lang].slug}/${article.slug}`);
}
