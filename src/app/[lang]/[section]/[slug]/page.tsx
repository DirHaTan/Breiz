import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectionBySlug } from "@/lib/sections";
import { articlePath, getAllArticles, getArticle, getTranslation } from "@/lib/articles";
import { Header } from "@/components/Header";
import { Paywall } from "@/components/Paywall";
import { Comments } from "@/components/Comments";
import { FormattedDate } from "@/components/FormattedDate";
import { getSection } from "@/lib/sections";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.flatMap((a) =>
    (["br", "fr"] as Locale[]).flatMap((lang) => {
      const text = a[lang];
      return text ? [{ lang, section: getSection(a.section)![lang].slug, slug: text.slug }] : [];
    }),
  );
}

async function load(params: PageProps<"/[lang]/[section]/[slug]">["params"]) {
  const { lang, section: sectionSlug, slug } = await params;
  if (!isLocale(lang)) return undefined;
  const section = getSectionBySlug(lang, sectionSlug);
  if (!section) return undefined;
  const article = await getArticle(lang, section.id, slug);
  if (!article) return undefined;
  const translation = await getTranslation(article.id, otherLocale(lang));
  return { lang, section, article, translation };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]/[slug]">): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { article, translation } = data;
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.date },
    alternates: {
      canonical: articlePath(article),
      languages: translation
        ? { [article.lang]: articlePath(article), [translation.lang]: articlePath(translation) }
        : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/[section]/[slug]">) {
  const data = await load(params);
  if (!data) notFound();
  const { lang, section, article, translation } = data;
  const dict = getDictionary(lang);

  // Every article is for subscribers: non-subscribers only see the first paragraph.
  // (Step 4 will show the full text to subscribers.)
  const [firstParagraph] = article.body;

  return (
    <>
      <Header
        lang={lang}
        dict={dict}
        activeSection={section.id}
        alternateHref={translation ? articlePath(translation) : undefined}
      />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href={localePath(lang, `/${section[lang].slug}`)}
          className="text-xs font-bold uppercase tracking-widest hover:underline"
        >
          {section[lang].name}
        </Link>
        <h1 className="mt-2 font-serif text-4xl font-black leading-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 font-serif text-xl text-muted">{article.excerpt}</p>
        <p className="mt-4 border-y border-ink py-2 text-sm">
          {dict.article.by} <strong>{article.author}</strong> · <FormattedDate date={article.date} lang={lang} />
          {translation && (
            <>
              {" · "}
              <Link href={articlePath(translation)} hrefLang={translation.lang} className="underline">
                {dict.article.translationAvailable}
              </Link>
            </>
          )}
        </p>
        <div className="mt-6 font-serif text-lg leading-relaxed">
          <p>{firstParagraph}</p>
        </div>
        <Paywall lang={lang} dict={dict} />
        <Comments dict={dict} />
      </main>
    </>
  );
}
