import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, otherLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getLatestArticles } from "@/lib/articles";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/ArticleCard";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    alternates: {
      canonical: localePath(lang),
      languages: { br: localePath("br"), fr: localePath("fr") },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [lead, ...rest] = await getLatestArticles(lang, 13);

  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={localePath(otherLocale(lang))} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {lead && (
          <section aria-label={dict.home.lead} className="border-b border-ink pb-8">
            <ArticleCard article={lead} size="lead" />
          </section>
        )}
        <h2 className="mt-8 mb-4 text-xs font-bold uppercase tracking-widest">{dict.home.latest}</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </>
  );
}
