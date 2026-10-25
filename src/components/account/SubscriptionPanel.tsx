import Link from "next/link";
import { subscribePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { planForPrice } from "@/lib/stripe";
import { getSubscriptionForUser } from "@/lib/subscriptions";
import { formatDate } from "@/components/FormattedDate";
import { openCustomerPortal } from "@/app/actions/billing";

// "Ma c'houmanant" on the account page: status, plan, renewal date, and a
// button to Stripe's page for changing card or cancelling.
export async function SubscriptionPanel({ lang, dict, userId }: { lang: Locale; dict: Dictionary; userId: string }) {
  const t = dict.billing;
  const subscription = await getSubscriptionForUser(userId);

  if (!subscription || subscription.status === "canceled" || subscription.status === "incomplete_expired") {
    return (
      <section className="mt-10 border-t border-ink pt-6">
        <h2 className="font-serif text-2xl font-bold">{t.subscription}</h2>
        <p className="mt-2 text-muted">{t.none}</p>
        <Link href={subscribePath(lang)} className="mt-4 inline-block bg-ink px-5 py-2 font-semibold text-paper hover:opacity-80">
          {dict.subscribe.button}
        </Link>
      </section>
    );
  }

  const plan = planForPrice(subscription.price_id);
  const status =
    subscription.status === "active" || subscription.status === "trialing"
      ? t.statusActive
      : subscription.status === "past_due" || subscription.status === "unpaid"
        ? t.statusPastDue
        : subscription.status === "incomplete" || subscription.status === "paused"
          ? t.statusIncomplete
          : t.statusCanceled;
  const date = subscription.current_period_end ? formatDate(subscription.current_period_end, lang) : null;

  return (
    <section className="mt-10 border-t border-ink pt-6">
      <h2 className="font-serif text-2xl font-bold">{t.subscription}</h2>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-semibold">{t.statusLabel}</dt>
        <dd>{status}</dd>
        {plan && (
          <>
            <dt className="font-semibold">{t.planLabel}</dt>
            <dd>{plan === "yearly" ? t.yearly : t.monthly}</dd>
          </>
        )}
        {date && (
          <>
            <dt className="font-semibold">{subscription.cancel_at_period_end ? t.ends : t.renews}</dt>
            <dd>{date}</dd>
          </>
        )}
      </dl>
      <form action={openCustomerPortal} className="mt-4">
        <input type="hidden" name="lang" value={lang} />
        <button className="border-2 border-ink px-5 py-2 font-semibold hover:bg-ink hover:text-paper">{t.manage}</button>
      </form>
    </section>
  );
}
