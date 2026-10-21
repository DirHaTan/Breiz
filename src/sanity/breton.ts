// check-breton: ignore-file (this file defines the spelling rule itself)
// Breiz writes Breton in skolveurieg, never with "zh". The editor uses this
// to refuse an article whose Breton text contains a "zh" spelling.
const zh = /\p{L}*zh\p{L}*/giu;

export function findForbiddenWords(text: string): string[] {
  return [...new Set(text.match(zh) ?? [])];
}

export function forbiddenMessage(words: string[]): string {
  return `Skolveurieg: no "zh" spellings please (found: ${words.join(", ")}).`;
}

// Collects all the text inside a Portable Text body.
export function portableTextToString(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
    .map((child: { text?: string }) => child?.text ?? "")
    .join(" ");
}
