import "server-only";
import { accountPath, checkoutCancelPath, checkoutSuccessPath, subscribePath, type Locale } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth";
import { priceIdFor, stripe, type Plan } from "@/lib/stripe";
import { ACTIVE_STATUSES, getOrCreateCustomer, getSubscriptionForUser } from "@/lib/subscriptions";
import { SITE_URL } from "@/lib/site";

// Where a reader who chose a plan should go next: Stripe's payment page,
// or the sign-in page (which then comes back here through
// checkoutStartPath), the account page if already subscribed, or the
// subscription page with an error.
export async function checkoutDestination(lang: Locale, plan: Plan): Promise<string> {
  const user = await getCurrentUser();
  if (!user) return `${accountPath(lang)}?next=${encodeURIComponent(checkoutStartPath(lang, plan))}`;

  const current = await getSubscriptionForUser(user.id);
  if (current && ACTIVE_STATUSES.includes(current.status)) return accountPath(lang);

  const price = priceIdFor(plan);
  if (!stripe || !price) return `${subscribePath(lang)}?error=1`;

  try {
    const customer = await getOrCreateCustomer(user.id, user.email);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      client_reference_id: user.id,
      line_items: [{ price, quantity: 1 }],
      locale: "fr", // Stripe has no Breton.
      subscription_data: { metadata: { supabase_user_id: user.id } },
      success_url: `${SITE_URL}${checkoutSuccessPath(lang)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}${checkoutCancelPath(lang)}`,
    });
    if (session.url) return session.url;
  } catch (error) {
    console.error("Starting Stripe Checkout failed:", error instanceof Error ? error.message : "unknown error");
  }
  return `${subscribePath(lang)}?error=1`;
}

// The address that starts Checkout for a plan once the reader is signed in.
export function checkoutStartPath(lang: Locale, plan: Plan): string {
  return `/api/stripe/checkout?lang=${lang}&plan=${plan}`;
}

export function readPlan(value: unknown): Plan {
  return value === "yearly" ? "yearly" : "monthly";
}
