import type { Metadata } from "next";
import Image from "next/image";
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
import { imageSrc } from "@/lib/images";
import { freePreview } from "@/lib/preview";
import { ArticleBody } from "@/components/ArticleBody";
import { PhotoCredit } from "@/components/PhotoCredit";
import { getSection } from "@/lib/sections";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  // Next.js needs at least one address to check the page at build time,
  // even before the first article is published.
  if (articles.length === 0) return [{ lang: "br", section: "keleier", slug: "pennad" }];
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
    openGraph: {
      type: "article",
      url: articlePath(article),
      siteName: getDictionary(article.lang).site.name,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      // The picture Facebook and others show when the article is shared.
      images: article.image ? [{ url: imageSrc(article.image, 1200), width: 1200, height: 675 }] : undefined,
    },
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

  // Articles are for subscribers: non-subscribers only see the beginning.
  // A "Pennad digoust" (free article) is shown in full to everyone.
  // (Step 4 will show the full text to subscribers.)
  const showFullText = article.free;
  const preview = showFullText ? "" : freePreview(article.body);
  const image = article.image && imageSrc(article.image, 1344);

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
        {image && (
          <figure className="mt-6">
            <Image src={image} alt={article.image?.alt ?? ""} width={1344} height={756} className="w-full" priority />
            <PhotoCredit image={article.image} prefix={dict.article.photoCredit} />
          </figure>
        )}
        {showFullText ? (
          <div className="mt-6">
            <ArticleBody body={article.body} />
          </div>
        ) : (
          <>
            <div className="mt-6 font-serif text-lg leading-relaxed">{preview && <p>{preview}</p>}</div>
            <Paywall lang={lang} dict={dict} />
          </>
        )}
        <Comments lang={lang} dict={dict} articleId={article.id} articleHref={articlePath(article)} />
      </main>
    </>
  );
}
