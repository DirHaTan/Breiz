"use server";

import { redirect } from "next/navigation";
import { accountPath, checkoutCancelPath, checkoutSuccessPath, subscribePath } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth";
import { priceIdFor, stripe, type Plan } from "@/lib/stripe";
import { ACTIVE_STATUSES, getOrCreateCustomer, getSubscriptionForUser } from "@/lib/subscriptions";
import { SITE_URL } from "@/lib/site";
import { readLocale } from "./shared";

// "Koumananti" button: sends a signed-in reader to Stripe's payment page.
export async function startCheckout(formData: FormData) {
  const lang = readLocale(formData);
  const plan: Plan = formData.get("plan") === "yearly" ? "yearly" : "monthly";

  // Not signed in yet: sign in first, then come back to the subscription page.
  const user = await getCurrentUser();
  if (!user) redirect(`${accountPath(lang)}?next=${encodeURIComponent(subscribePath(lang))}`);

  // Already subscribed: the account page shows the subscription.
  const current = await getSubscriptionForUser(user.id);
  if (current && ACTIVE_STATUSES.includes(current.status)) redirect(accountPath(lang));

  const price = priceIdFor(plan);
  if (!stripe || !price) redirect(`${subscribePath(lang)}?error=1`);

  let url: string | null = null;
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
    url = session.url;
  } catch (error) {
    console.error("Starting Stripe Checkout failed:", error instanceof Error ? error.message : "unknown error");
  }
  redirect(url ?? `${subscribePath(lang)}?error=1`);
}

// "Mera ma c'houmanant": Stripe's page to change card, switch plan or cancel.
export async function openCustomerPortal(formData: FormData) {
  const lang = readLocale(formData);
  const user = await getCurrentUser();
  if (!user) redirect(accountPath(lang));
  const subscription = await getSubscriptionForUser(user.id);
  if (!stripe || !subscription) redirect(accountPath(lang));

  let url: string | null = null;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      locale: "fr",
      return_url: `${SITE_URL}${accountPath(lang)}`,
    });
    url = session.url;
  } catch (error) {
    console.error("Opening Stripe Customer Portal failed:", error instanceof Error ? error.message : "unknown error");
  }
  redirect(url ?? `${accountPath(lang)}?error=portal`);
}
