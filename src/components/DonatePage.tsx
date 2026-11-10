import Link from "next/link";
import { donatePath, subscribePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DONATE_URL } from "@/lib/donate";
import { Header } from "@/components/Header";

// The donation page (/skoazia, /fr/soutenir). The button links to PayPal's own
// secure donation page, so no payment script runs on this site.
export function DonatePage({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.donate;
  return (
    <>
      <Header lang={lang} dict={dict} alternate={donatePath} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-serif text-4xl font-black">{t.title}</h1>
        <p className="mt-4 font-serif text-lg">{t.intro}</p>
        <h2 className="mt-8 font-serif text-2xl font-bold">{t.whatTitle}</h2>
        <ul className="mt-3 space-y-2">
          {t.items.map((item) => (
            <li key={item} className="border-t border-ink pt-2">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          {DONATE_URL ? (
            <>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-ink px-6 py-3 font-semibold text-paper hover:opacity-80"
              >
                {t.button}
              </a>
              <p className="mt-3 text-sm">{t.how}</p>
            </>
          ) : (
            <p className="border-2 border-ink p-4 font-semibold">{t.soon}</p>
          )}
        </div>
        <p className="mt-8 text-sm">
          {t.note}{" "}
          <Link href={subscribePath(lang)} className="font-semibold underline underline-offset-4">
            {t.subscribeLink}
          </Link>
          .
        </p>
        <p className="mt-2 text-sm opacity-80">{t.tax}</p>
        <p className="mt-8 font-serif text-2xl font-bold">{t.thanks}</p>
      </main>
    </>
  );
}
