import Link from "next/link";
import { announcePath, localePath, otherLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ANNOUNCEMENTS_SECTION, getSection } from "@/lib/sections";
import { ANNOUNCEMENTS_EMAIL } from "@/lib/contact";
import { Header } from "@/components/Header";

// How readers send an announcement for free publication in "Embannit ganeomp".
export function AnnouncePage({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.announce;
  const section = getSection(ANNOUNCEMENTS_SECTION)!;
  return (
    <>
      <Header
        lang={lang}
        dict={dict}
        activeSection={section.id}
        alternateHref={announcePath(otherLocale(lang))}
      />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href={localePath(lang, `/${section[lang].slug}`)}
          className="text-xs font-bold uppercase tracking-widest hover:underline"
        >
          {section[lang].name}
        </Link>
        <h1 className="mt-2 font-serif text-4xl font-black">{t.title}</h1>
        <p className="mt-4 font-serif text-lg">{t.intro}</p>
        <h2 className="mt-8 font-serif text-2xl font-bold">{t.whatTitle}</h2>
        <ul className="mt-3 space-y-2">
          {t.items.map((item) => (
            <li key={item} className="border-t border-ink pt-2">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-semibold">{t.sendTitle}</p>
        <p className="mt-2">
          <a href={`mailto:${ANNOUNCEMENTS_EMAIL}`} className="font-serif text-2xl underline">
            {ANNOUNCEMENTS_EMAIL}
          </a>
        </p>
        <p className="mt-2">{t.alsoArticles}</p>
        <p className="mt-8 border-2 border-ink p-4 text-sm">{t.note}</p>
      </main>
    </>
  );
}
