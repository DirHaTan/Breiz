import { Suspense } from "react";
import Link from "next/link";
import { accountPath, legalPath, otherLocale, subscribePath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVE_STATUSES, getSubscriptionForUser } from "@/lib/subscriptions";
import { isSupabaseConfigured } from "@/supabase/env";
import { startCheckout } from "@/app/actions/billing";
import { Header } from "@/components/Header";

type SearchParams = Promise<{ error?: string | string[] }>;

// The subscription page: two plans, each with a "Koumananti" button that
// opens Stripe's payment page (after signing in, if needed).
export function SubscribePage({ lang, searchParams }: { lang: Locale; searchParams: SearchParams }) {
  const dict = getDictionary(lang);
  const t = dict.subscribe;
  const plans = [
    { id: "monthly", ...t.monthly },
    { id: "yearly", ...t.yearly },
  ];
  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={subscribePath(otherLocale(lang))} />
      <main className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="font-serif text-4xl font-black">{t.title}</h1>
        <p className="mt-4 text-lg text-muted">{t.intro}</p>
        {isSupabaseConfigured && (
          <Suspense fallback={null}>
            <SubscribeStatus lang={lang} dict={dict} searchParams={searchParams} />
          </Suspense>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <form key={plan.id} action={startCheckout} className="border-2 border-ink p-6">
              <input type="hidden" name="lang" value={lang} />
              <input type="hidden" name="plan" value={plan.id} />
              <p className="font-serif text-5xl font-black">{plan.price}</p>
              <p className="mt-1 uppercase tracking-widest">{plan.period}</p>
              <p className="mt-2 h-5 text-sm font-semibold">{plan.note}</p>
              <button className="mt-4 w-full bg-ink px-6 py-3 font-semibold text-paper hover:opacity-80">{t.button}</button>
            </form>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          {t.termsIntro}{" "}
          <Link href={legalPath("terms", lang)} className="underline">
            {t.termsLink}
          </Link>
          .
        </p>
        <ul className="mt-8 space-y-2 text-left">
          {t.features.map((f) => (
            <li key={f} className="border-t border-ink pt-2">
              ✓ {f}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

// "Already subscribed" or an error message, depending on the reader.
async function SubscribeStatus({ lang, dict, searchParams }: { lang: Locale; dict: Dictionary; searchParams: SearchParams }) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  const subscription = user ? await getSubscriptionForUser(user.id) : null;
  if (subscription && ACTIVE_STATUSES.includes(subscription.status)) {
    return (
      <p className="mt-6 border-2 border-ink p-4 font-semibold">
        {dict.subscribe.already}{" "}
        <Link href={accountPath(lang)} className="underline">
          {dict.nav.account}
        </Link>
      </p>
    );
  }
  if (params.error) return <p className="mt-6 font-semibold text-red-700">{dict.account.genericError}</p>;
  return null;
}
