import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, locales, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectionBySlug, sections } from "@/lib/sections";
import { getArticlesBySection } from "@/lib/articles";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";

export function generateStaticParams() {
  return locales.flatMap((lang) => sections.map((s) => ({ lang, section: s[lang].slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]">): Promise<Metadata> {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) return {};
  const section = getSectionBySlug(lang, slug);
  if (!section) return {};
  return {
    title: section[lang].name,
    alternates: {
      canonical: localePath(lang, `/${section[lang].slug}`),
      languages: {
        br: localePath("br", `/${section.br.slug}`),
        fr: localePath("fr", `/${section.fr.slug}`),
      },
    },
  };
}

export default async function SectionPage({ params }: PageProps<"/[lang]/[section]">) {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) notFound();
  const section = getSectionBySlug(lang, slug);
  if (!section) notFound();
  const dict = getDictionary(lang);
  const articles = await getArticlesBySection(lang, section.id);
  const other = otherLocale(lang);

  return (
    <>
      <Header
        lang={lang}
        dict={dict}
        activeSection={section.id}
        alternateHref={localePath(other, `/${section[other].slug}`)}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-4xl font-black">{section[lang].name}</h1>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </>
  );
}
