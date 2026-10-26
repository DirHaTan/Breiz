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
  const [lead, ...others] = await getLatestArticles(lang, 19);
  const latest = others.slice(0, 6);
  const rest = others.slice(6);

  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={localePath(otherLocale(lang))} />
      <main className="mx-auto max-w-[90rem] px-4 py-8 lg:px-6 xl:px-8">
        {/* Lead article (2/3) beside the latest list (1/3) on wide screens;
            stacked in one column on phones and tablets. */}
        <div className="grid gap-8 border-b border-ink pb-8 lg:grid-cols-3">
          {lead && (
            <section aria-label={dict.home.lead} className="lg:col-span-2">
              <ArticleCard article={lead} size="lead" />
            </section>
          )}
          {latest.length > 0 && (
            <section aria-labelledby="latest-heading" className="lg:border-l lg:border-ink lg:pl-8">
              <h2 id="latest-heading" className="border-b-2 border-ink pb-2 text-xs font-bold uppercase tracking-widest">
                {dict.home.latest}
              </h2>
              <ul className="divide-y divide-ink/20">
                {latest.map((article) => (
                  <li key={article.id} className="py-3">
                    <ArticleCard article={article} size="compact" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        {rest.length > 0 && (
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
