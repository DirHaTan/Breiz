import Image from "next/image";
import Link from "next/link";
import { articlePath, type LocalizedArticle } from "@/lib/articles";
import { getSection } from "@/lib/sections";
import { localePath } from "@/i18n/config";
import { FormattedDate } from "@/components/FormattedDate";
import { imageSrc } from "@/lib/images";

export function ArticleCard({ article, size = "normal" }: { article: LocalizedArticle; size?: "normal" | "lead" }) {
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
            className="mb-3 w-full"
            priority={lead}
          />
        </Link>
      )}
      <Link
        href={localePath(article.lang, `/${section[article.lang].slug}`)}
        className="text-xs font-bold uppercase tracking-widest hover:underline"
      >
        {section[article.lang].name}
      </Link>
      <h2 className={`mt-1 font-serif font-bold leading-tight ${lead ? "text-4xl sm:text-5xl" : "text-xl"}`}>
        <Link href={articlePath(article)} className="hover:underline">
          {article.title}
        </Link>
      </h2>
      <p className={`mt-2 text-muted ${lead ? "text-lg" : ""}`}>{article.excerpt}</p>
      <p className="mt-2 text-xs text-muted">
        <FormattedDate date={article.date} lang={article.lang} />
      </p>
    </article>
  );
}
