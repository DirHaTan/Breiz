// The recording of an article, with who reads it. Only rendered for readers
// who can see the full text (see the article page).
export function ArticleAudio({ src, credit, label }: { src?: string | null; credit?: string | null; label: string }) {
  if (!src) return null;
  return (
    <figure className="mt-6 border-y border-ink py-3">
      <figcaption className="mb-2 text-xs font-bold uppercase tracking-widest">
        {label}
        {credit?.trim() && <span className="font-normal normal-case tracking-normal text-muted"> · {credit.trim()}</span>}
      </figcaption>
      <audio controls preload="none" src={src} className="w-full">
        <a href={src}>{label}</a>
      </audio>
    </figure>
  );
}
