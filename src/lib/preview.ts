import { toPlainText, type PortableTextBlock } from "@portabletext/react";

// What readers who haven't paid see of an article: the first paragraph,
// but never more than 40% of the whole text (so a short article is never
// shown in full).
export function freePreview(body: PortableTextBlock[]): string {
  const paragraphs = body
    .filter((block) => block._type === "block")
    .map((block) => toPlainText([block]).trim())
    .filter(Boolean);
  const first = paragraphs[0] ?? "";
  const limit = Math.floor(paragraphs.join(" ").length * 0.4);
  if (first.length <= limit) return first;
  const cut = first.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
