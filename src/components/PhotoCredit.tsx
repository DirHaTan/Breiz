import type { ArticleImage } from "@/lib/articles";

// "Skeudenn: …" / "Photo : …" under the main image, only when a credit is set.
// With a source link, the credit opens it in a new tab.
export function PhotoCredit({ image, prefix }: { image?: ArticleImage | null; prefix: string }) {
  const credit = image?.credit?.trim();
  if (!credit) return null;
  const url = image?.creditUrl?.trim();
  return (
    <figcaption className="mt-1 text-right text-xs leading-snug break-words text-muted">
      {prefix}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
          {credit}
        </a>
      ) : (
        credit
      )}
    </figcaption>
  );
}
