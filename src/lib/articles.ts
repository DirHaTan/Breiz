import { cacheLife } from "next/cache";
import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/config";
import { getSection, type SectionId } from "@/lib/sections";
import type { DepartmentId } from "@/lib/departments";
import { isSanityConfigured } from "@/sanity/env";
import sampleArticles from "@/content/sample-articles.json";

// Articles come from Sanity. Until Sanity is connected (see README), the
// site shows the sample articles in src/content/sample-articles.json.

type ArticleText = {
  slug: string;
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
};

export type ArticleImage = SanityImageSource & { alt?: string; credit?: string; creditUrl?: string };

export type Article = {
  id: string;
  section: SectionId;
  author: string;
  date: string;
  // Only for articles in the Breiz section.
  department?: DepartmentId | null;
  // "Pennad digoust": shown in full to everyone, without the paywall.
  free?: boolean;
  image?: ArticleImage | null;
  br?: ArticleText | null;
  fr?: ArticleText | null;
};

// One article seen in a single language.
export type LocalizedArticle = ArticleText & {
  id: string;
  lang: Locale;
  section: SectionId;
  author: string;
  date: string;
  department: DepartmentId | null;
  free: boolean;
  image?: ArticleImage | null;
};

// Only the private online copies made by the editor's "Embann" button
// (see src/sanity/live.ts), and only while the article still exists in the editor.
const articlesQuery = defineQuery(`
  *[_type == "liveArticle" && _id in path("pennad.*") && defined(section) && defined(br.slug.current)
    && count(*[_id in [^.sourceId, ^.draftId]]) > 0] | order(publishedAt desc) {
    "id": sourceId,
    section,
    "author": coalesce(author->name, "Keleier Breiz hag ar Bed"),
    "date": publishedAt,
    "department": select(section == "breiz" => department, null),
    "free": coalesce(free, false),
    "image": mainImage,
    "br": br { title, "slug": slug.current, excerpt, "body": coalesce(body, []) },
    "fr": select(
      defined(fr.title) && defined(fr.slug.current) => fr { title, "slug": slug.current, excerpt, "body": coalesce(body, []) },
      null
    )
  }
`);

// Turns the sample file's plain paragraphs into the same format Sanity uses.
function toBlocks(paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text, marks: [] }],
  }));
}

type SampleText = Omit<ArticleText, "body"> & { body: string[] };
type SampleArticle = Omit<Article, "br" | "fr"> & { br?: SampleText; fr?: SampleText };

function samples(): Article[] {
  return (sampleArticles as SampleArticle[])
    .map((a) => ({
      ...a,
      br: a.br && { ...a.br, body: toBlocks(a.br.body) },
      fr: a.fr && { ...a.fr, body: toBlocks(a.fr.body) },
    }))
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

// Fetches all articles. The result is kept for about a minute, so a newly
// published article appears on the site within a minute or two.
export async function getAllArticles(): Promise<Article[]> {
  "use cache";
  cacheLife("minutes");
  if (!isSanityConfigured) return samples();
  const { client } = await import("@/sanity/client");
  const articles = await client.fetch<Article[]>(articlesQuery);
  // Skip articles whose section the site doesn't know (e.g. a new section
  // used in the editor before the site is updated), instead of breaking pages.
  return articles.filter((a) => getSection(a.section));
}

function localize(article: Article, lang: Locale): LocalizedArticle | undefined {
  const text = article[lang];
  if (!text) return undefined;
  return {
    ...text,
    id: article.id,
    lang,
    section: article.section,
    author: article.author,
    date: article.date,
    department: article.department ?? null,
    free: article.free ?? false,
    image: article.image,
  };
}

export async function getLatestArticles(lang: Locale, limit?: number) {
  const list = (await getAllArticles()).flatMap((a) => localize(a, lang) ?? []);
  return limit ? list.slice(0, limit) : list;
}

export async function getArticlesBySection(lang: Locale, section: SectionId) {
  return (await getAllArticles())
    .filter((a) => a.section === section)
    .flatMap((a) => localize(a, lang) ?? []);
}

export async function getArticle(lang: Locale, section: SectionId, slug: string) {
  const article = (await getAllArticles()).find((a) => a.section === section && a[lang]?.slug === slug);
  return article && localize(article, lang);
}

// The same article in the other language, if it has been translated.
export async function getTranslation(id: string, lang: Locale) {
  const article = (await getAllArticles()).find((a) => a.id === id);
  return article && localize(article, lang);
}

export function articlePath(article: Pick<LocalizedArticle, "section" | "lang" | "slug">): string {
  const section = getSection(article.section)!;
  return localePath(article.lang, `/${section[article.lang].slug}/${article.slug}`);
}
