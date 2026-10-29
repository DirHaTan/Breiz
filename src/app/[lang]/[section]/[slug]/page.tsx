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
import { Suspense } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { canReadPaidArticles } from "@/lib/access";
import { isSupabaseConfigured } from "@/supabase/env";
import { FormattedDate } from "@/components/FormattedDate";
import { imageSrc } from "@/lib/images";
import { freePreview } from "@/lib/preview";
import { ArticleBody } from "@/components/ArticleBody";
import { PhotoCredit } from "@/components/PhotoCredit";
import { getSection } from "@/lib/sections";
import { ShareLinks } from "@/components/ShareLinks";
import { DEFAULT_SHARE_IMAGE, SITE_URL } from "@/lib/site";

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
  // The picture Facebook, X and others show when the article is shared. An
  // article without its own picture uses the site's default picture.
  const images = article.image
    ? [{ url: imageSrc(article.image, 1200), width: 1200, height: 675, alt: article.image.alt ?? article.title }]
    : [DEFAULT_SHARE_IMAGE];
  return {
    title: article.title,
    description: article.excerpt,
    // These replace the layout's openGraph and twitter settings, so they repeat
    // the site name, language and card type.
    openGraph: {
      type: "article",
      url: `${SITE_URL}${articlePath(article)}`,
      siteName: getDictionary(article.lang).site.name,
      locale: article.lang === "br" ? "br_FR" : "fr_FR",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      images,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt, images },
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

  // Articles are for subscribers. A "Pennad digoust" is shown in full to
  // everyone; otherwise the summary and paywall are shown, and the full text
  // only streams in for subscribers and editors (see PaidArticleText).
  const preview = (
    <div className="mt-6 font-serif text-lg leading-relaxed">
      <p>{freePreview(article.body)}</p>
    </div>
  );
  const teaser = (
    <>
      {preview}
      <Paywall lang={lang} dict={dict} articleHref={articlePath(article)} />
    </>
  );
  // Shown while the reader's access is checked, so subscribers never see the
  // paywall flash before their full text arrives.
  const loading = (
    <>
      {preview}
      <div aria-busy="true" className="mt-4 animate-pulse space-y-3">
        <div className="h-4 w-full bg-ink/10" />
        <div className="h-4 w-11/12 bg-ink/10" />
        <div className="h-4 w-4/5 bg-ink/10" />
      </div>
    </>
  );
  const image = article.image && imageSrc(article.image, 1344);
  const share = <ShareLinks url={`${SITE_URL}${articlePath(article)}`} title={article.title} labels={dict.share} />;

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
        {share}
        {image && (
          <figure className="mt-6">
            <Image src={image} alt={article.image?.alt ?? ""} width={1344} height={756} className="w-full" priority />
            <PhotoCredit image={article.image} prefix={dict.article.photoCredit} />
          </figure>
        )}
        {article.free ? (
          <div className="mt-6">
            <ArticleBody body={article.body} />
          </div>
        ) : isSupabaseConfigured ? (
          <Suspense fallback={loading}>
            <PaidArticleText body={article.body} teaser={teaser} />
          </Suspense>
        ) : (
          teaser
        )}
        <div className="mt-8 border-t border-ink pt-2">{share}</div>
        <Comments lang={lang} dict={dict} articleId={article.id} articleHref={articlePath(article)} />
      </main>
    </>
  );
}

// The full text for subscribers and editors; everyone else keeps the teaser.
async function PaidArticleText({ body, teaser }: { body: PortableTextBlock[]; teaser: React.ReactNode }) {
  if (!(await canReadPaidArticles())) return teaser;
  return (
    <div className="mt-6">
      <ArticleBody body={body} />
    </div>
  );
}
