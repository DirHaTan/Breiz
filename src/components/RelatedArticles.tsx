import Link from "next/link";
import { FormattedDate } from "@/components/FormattedDate";
import { articlePath, type LocalizedArticle } from "@/lib/articles";

type Labels = { series: string; more: string; reading: string };

// Under an article: the whole series it belongs to (the current part in bold,
// not a link), then a few recent articles from the same section. Only titles
// and links, so paid texts stay behind the paywall.
export function RelatedArticles({
  current,
  series,
  more,
  labels,
}: {
  current: LocalizedArticle;
  series: { name: string; articles: LocalizedArticle[] } | null;
  more: LocalizedArticle[];
  labels: Labels;
}) {
  if (!series && more.length === 0) return null;
  return (
    <aside className="mt-8 space-y-6">
      {series && (
        <nav aria-label={`${labels.series}: ${series.name}`} className="border-2 border-ink p-4">
          <p className="text-xs font-bold uppercase tracking-widest">
            {labels.series}: {series.name}
          </p>
          <ol className="mt-3 space-y-2 font-serif">
            {series.articles.map((a) =>
              a.id === current.id ? (
                <li key={a.id} aria-current="page" className="font-bold">
                  {a.title} <span className="font-sans text-xs font-normal text-muted">· {labels.reading}</span>
                </li>
              ) : (
                <li key={a.id}>
                  <Link href={articlePath(a)} className="underline-offset-4 hover:underline">
                    {a.title}
                  </Link>
                </li>
              ),
            )}
          </ol>
        </nav>
      )}
      {more.length > 0 && (
        <nav aria-label={labels.more} className="border-t border-ink pt-3">
          <p className="text-xs font-bold uppercase tracking-widest">{labels.more}</p>
          <ul className="mt-3 space-y-3">
            {more.map((a) => (
              <li key={a.id}>
                <Link href={articlePath(a)} className="font-serif text-lg font-bold leading-snug underline-offset-4 hover:underline">
                  {a.title}
                </Link>
                <p className="text-xs text-muted">
                  <FormattedDate date={a.date} lang={a.lang} />
                </p>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
