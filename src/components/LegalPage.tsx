import { legalPath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { legalPages, type LegalKind } from "@/content/legal";
import { Header } from "@/components/Header";

// "Mentions légales" / "Notennou lezennel" and "Politique de confidentialité" / "Prevezded".
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
            {section.lines.map((line) => (
              <p key={line} className="mt-2 break-words">
                {line.startsWith("https://") ? (
                  <a href={line} className="underline" rel="noopener noreferrer">
                    {line}
                  </a>
                ) : (
                  line
                )}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
