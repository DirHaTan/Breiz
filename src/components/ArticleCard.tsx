import Image from "next/image";
import Link from "next/link";
import { articlePath, type LocalizedArticle } from "@/lib/articles";
import { getSection } from "@/lib/sections";
import { localePath } from "@/i18n/config";
import { FormattedDate } from "@/components/FormattedDate";
import { imageSrc } from "@/lib/images";
import { getDictionary } from "@/i18n/dictionaries";

type Size = "normal" | "lead" | "compact";

export function ArticleCard({ article, size = "normal" }: { article: LocalizedArticle; size?: Size }) {
  if (size === "compact") return <CompactArticleCard article={article} />;
  const section = getSection(article.section)!;
  const lead = size === "lead";
  const image = article.image && imageSrc(article.image, lead ? 1200 : 640);
  return (
    <article className={lead ? "" : "border-t border-ink pt-4"}>
      {image && (
        <Link href={articlePath(article)} tabIndex={-1} aria-hidden="true">
          <Image
            src={image}
            alt=""
            width={lead ? 1200 : 640}
            height={lead ? 675 : 360}
            // The lead image stays 16:9 but never taller than 420px.
            className={lead ? "mb-3 aspect-video max-h-[420px] w-full object-cover" : "mb-3 w-full"}
            priority={lead}
          />
        </Link>
      )}
      <SectionLabel article={article} section={section} />
      <h2 className={`mt-1 font-serif font-bold leading-tight ${lead ? "text-3xl lg:text-4xl" : "text-xl"}`}>
        <Link href={articlePath(article)} className="hover:underline">
          {article.title}
        </Link>
      </h2>
      <p className={`mt-2 text-muted ${lead ? "text-lg" : ""}`}>{article.excerpt}</p>
      <p className="mt-2 text-xs text-muted">
        {getDictionary(article.lang).article.by} <span className="font-semibold text-ink">{article.author}</span> ·{" "}
        <FormattedDate date={article.date} lang={article.lang} />
      </p>
    </article>
  );
}

// A small row for the homepage sidebar: thumbnail, section, title and date.
function CompactArticleCard({ article }: { article: LocalizedArticle }) {
  const section = getSection(article.section)!;
  const image = article.image && imageSrc(article.image, 240);
  return (
    <article className="flex gap-3">
      {image && (
        <Link href={articlePath(article)} tabIndex={-1} aria-hidden="true" className="shrink-0">
          <Image src={image} alt="" width={240} height={135} className="aspect-video w-24 object-cover" />
        </Link>
      )}
      <div className="min-w-0">
        <SectionLabel article={article} section={section} />
        <h3 className="mt-0.5 font-serif font-bold leading-snug">
          <Link href={articlePath(article)} className="hover:underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted">
          <FormattedDate date={article.date} lang={article.lang} />
        </p>
      </div>
    </article>
  );
}

function SectionLabel({
  article,
  section,
}: {
  article: LocalizedArticle;
  section: NonNullable<ReturnType<typeof getSection>>;
}) {
  return (
    <Link
      href={localePath(article.lang, `/${section[article.lang].slug}`)}
      className="text-xs font-bold uppercase tracking-widest hover:underline"
    >
      {section[article.lang].name}
    </Link>
  );
}
