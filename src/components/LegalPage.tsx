import type { ReactNode } from "react";
import { legalPath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { legalPages, type LegalKind } from "@/content/legal";
import { Header } from "@/components/Header";

// "Notennou lezennel" / "Mentions légales", "Prevezded" / "Confidentialité"
// and "Divizou gwerza" / "CGV".
export function LegalPage({ kind, lang }: { kind: LegalKind; lang: Locale }) {
  const dict = getDictionary(lang);
  const page = legalPages[kind][lang];
  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={legalPath(kind, otherLocale(lang))} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-serif text-4xl font-black">{page.title}</h1>
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-8 border-t border-ink pt-4">
            <h2 className="font-serif text-2xl font-bold">{section.heading}</h2>
            {groupLines(section.lines).map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i} className="mt-2 list-disc space-y-1 pl-6">
                  {block.map((item) => (
                    <li key={item} className="break-words">
                      {linkify(item)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="mt-2 break-words">
                  {linkify(block)}
                </p>
              ),
            )}
          </section>
        ))}
      </main>
    </>
  );
}

// Consecutive "- " lines become one list; other lines stay paragraphs.
function groupLines(lines: string[]): (string | string[])[] {
  const blocks: (string | string[])[] = [];
  for (const line of lines) {
    if (line.startsWith("- ")) {
      const last = blocks.at(-1);
      if (Array.isArray(last)) last.push(line.slice(2));
      else blocks.push([line.slice(2)]);
    } else {
      blocks.push(line);
    }
  }
  return blocks;
}

// [text](https://…) links, bare https:// links and email addresses.
const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)|(https:\/\/[^\s)]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function linkify(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, labelledUrl, url, email] = match;
    if (match.index > last) parts.push(text.slice(last, match.index));
    const href = labelledUrl ?? url ?? `mailto:${email}`;
    const external = href.startsWith("https://");
    parts.push(
      <a key={match.index} href={href} className="underline" rel={external ? "noopener noreferrer" : undefined}>
        {label ?? url ?? email}
      </a>,
    );
    last = match.index + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
