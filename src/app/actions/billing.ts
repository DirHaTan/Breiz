"use server";

import { redirect } from "next/navigation";
import { accountPath } from "@/i18n/config";
import { getCurrentUser } from "@/lib/auth";
import { checkoutDestination, readPlan } from "@/lib/checkout";
import { stripe } from "@/lib/stripe";
import { getSubscriptionForUser } from "@/lib/subscriptions";
import { SITE_URL } from "@/lib/site";
import { readLocale } from "./shared";

// "Koumananti" button: sends the reader to Stripe's payment page (after
// signing in, if needed; see checkoutDestination).
export async function startCheckout(formData: FormData) {
  redirect(await checkoutDestination(readLocale(formData), readPlan(formData.get("plan"))));
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
