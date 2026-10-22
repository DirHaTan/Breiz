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
      <main className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="font-serif text-4xl font-black">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[t.monthly, t.yearly].map((plan) => (
            <div key={plan.period} className="border-2 border-ink p-6">
              <p className="font-serif text-5xl font-black">{plan.price}</p>
              <p className="mt-1 uppercase tracking-widest">{plan.period}</p>
              <p className="mt-2 h-5 text-sm font-semibold">{plan.note}</p>
              <button
                type="button"
                disabled
                className="mt-4 w-full bg-ink px-6 py-3 font-semibold text-paper disabled:opacity-50"
              >
                {t.button}
              </button>
            </div>
          ))}
        </div>
        <ul className="mt-8 space-y-2 text-left">
          {t.features.map((f) => (
            <li key={f} className="border-t border-ink pt-2">
              ✓ {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">{t.comingSoon}</p>
      </main>
    </>
  );
}
