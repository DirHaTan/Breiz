import { otherLocale, subscribePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";

// The subscription page. The payment button is switched on in Step 4 (Stripe).
export function SubscribePage({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const t = dict.subscribe;
  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={subscribePath(otherLocale(lang))} />
      <main className="mx-auto max-w-xl px-4 py-12 text-center">
        <h1 className="font-serif text-4xl font-black">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
        <div className="mt-8 border-2 border-ink p-8">
          <p className="font-serif text-6xl font-black">{t.price}</p>
          <p className="mt-1 uppercase tracking-widest">{t.period}</p>
          <ul className="mt-6 space-y-2 text-left">
            {t.features.map((f) => (
              <li key={f} className="border-t border-ink pt-2">
                ✓ {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="mt-8 w-full bg-ink px-6 py-3 font-semibold text-paper disabled:opacity-50"
          >
            {t.button}
          </button>
          <p className="mt-3 text-sm text-muted">{t.comingSoon}</p>
        </div>
      </main>
    </>
  );
}
