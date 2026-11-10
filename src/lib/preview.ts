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

// The pieces of text read aloud by the "Listen" player: the title, the
// summary, then each paragraph and subheading. A closing reading list
// (a heading followed only by list items) is left out.
export function narrationParts(title: string, excerpt: string, body: PortableTextBlock[]): string[] {
  const blocks = body.filter((block) => block._type === "block");
  let end = blocks.length;
  while (end > 0 && (blocks[end - 1] as { listItem?: string }).listItem) end--;
  if (end < blocks.length && end > 0 && /^h\d$/.test(String((blocks[end - 1] as { style?: string }).style))) end--;
  const paragraphs = blocks
    .slice(0, end)
    .map((block) => toPlainText([block]).trim())
    .filter(Boolean);
  return [title, excerpt, ...paragraphs].map((t) => t.trim()).filter(Boolean);
}
