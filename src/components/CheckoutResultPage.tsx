import { Suspense } from "react";
import Link from "next/link";
import { accountPath, checkoutCancelPath, checkoutSuccessPath, localePath, otherLocale, subscribePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { syncSubscription } from "@/lib/subscriptions";
import { Header } from "@/components/Header";

type SearchParams = Promise<{ session_id?: string | string[] }>;

// Where Stripe sends the reader back: "success" after paying, "cancel" if they gave up.
export function CheckoutResultPage({ lang, result, searchParams }: { lang: Locale; result: "success" | "cancel"; searchParams?: SearchParams }) {
  const dict = getDictionary(lang);
  const t = dict.billing;
  const other = otherLocale(lang);
  const success = result === "success";
  return (
    <>
      <Header
        lang={lang}
        dict={dict}
        alternateHref={success ? checkoutSuccessPath(other) : checkoutCancelPath(other)}
      />
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-serif text-4xl font-black">{success ? t.successTitle : t.cancelTitle}</h1>
        <p className="mt-4 text-lg">{success ? t.successText : t.cancelText}</p>
        <p className="mt-2 text-muted">{success ? t.successWait : t.cancelRetry}</p>
        {success && searchParams && (
          <Suspense fallback={null}>
            <ConfirmCheckout searchParams={searchParams} />
          </Suspense>
        )}
        <p className="mt-8 flex flex-wrap justify-center gap-4">
          {success ? (
            <Link href={localePath(lang)} className="bg-ink px-5 py-2 font-semibold text-paper hover:opacity-80">
              {dict.notFound.back}
            </Link>
          ) : (
            <Link href={subscribePath(lang)} className="bg-ink px-5 py-2 font-semibold text-paper hover:opacity-80">
              {dict.subscribe.button}
            </Link>
          )}
          <Link href={accountPath(lang)} className="border-2 border-ink px-5 py-2 font-semibold">
            {dict.nav.account}
          </Link>
        </p>
      </main>
    </>
  );
}

// Right after paying, ask Stripe directly so the full articles open at once,
// without waiting for the webhook. Only for the reader who paid.
async function ConfirmCheckout({ searchParams }: { searchParams: SearchParams }) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : undefined;
  const user = await getCurrentUser();
  if (!sessionId || !user || !stripe) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.client_reference_id === user.id && session.subscription) {
      await syncSubscription(typeof session.subscription === "string" ? session.subscription : session.subscription.id);
    }
  } catch (error) {
    console.error("Confirming checkout failed:", error instanceof Error ? error.message : "unknown error");
  }
  return null;
}
