import "server-only";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/supabase/admin";
import { createClient } from "@/supabase/server";

// Statuses that give access to the full text.
export const ACTIVE_STATUSES = ["active", "trialing"];

export type SubscriptionRow = {
  stripe_subscription_id: string;
  user_id: string;
  stripe_customer_id: string;
  price_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

// The reader's most relevant subscription (an active one first), read with
// their own session: the database only returns their own rows.
export async function getSubscriptionForUser(userId: string): Promise<SubscriptionRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id, user_id, stripe_customer_id, price_id, status, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .limit(10);
  if (error) {
    console.error("Loading subscription failed:", error.message);
    return null;
  }
  const rows = (data ?? []) as SubscriptionRow[];
  return rows.find((r) => ACTIVE_STATUSES.includes(r.status)) ?? rows[0] ?? null;
}

// The Stripe customer of a reader, created the first time they subscribe.
// The customer carries the Supabase user ID, so Stripe and the site stay linked.
export async function getOrCreateCustomer(userId: string, email: string): Promise<string> {
  if (!stripe || !supabaseAdmin) throw new Error("Stripe or Supabase admin is not configured");
  const existing = await supabaseAdmin.from("stripe_customers").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
  if (existing.data?.stripe_customer_id) return existing.data.stripe_customer_id;

  const customer = await stripe.customers.create(
    { email: email || undefined, metadata: { supabase_user_id: userId } },
    // The same key twice (e.g. a double click) returns the same customer.
    { idempotencyKey: `customer-${userId}` },
  );
  const { error } = await supabaseAdmin
    .from("stripe_customers")
    .upsert({ user_id: userId, stripe_customer_id: customer.id }, { onConflict: "user_id", ignoreDuplicates: true });
  if (error) throw new Error(`Saving Stripe customer failed: ${error.message}`);
  const saved = await supabaseAdmin.from("stripe_customers").select("stripe_customer_id").eq("user_id", userId).single();
  return saved.data?.stripe_customer_id ?? customer.id;
}

async function userIdForSubscription(subscription: Stripe.Subscription): Promise<string | null> {
  const fromMetadata = subscription.metadata?.supabase_user_id;
  if (fromMetadata) return fromMetadata;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const { data } = await supabaseAdmin!.from("stripe_customers").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
  return data?.user_id ?? null;
}

// Copies a subscription's current state from Stripe into Supabase.
// It always asks Stripe for the latest version, so events arriving twice or
// out of order still leave the right result (idempotent).
export async function syncSubscription(subscriptionId: string): Promise<void> {
  if (!stripe || !supabaseAdmin) throw new Error("Stripe or Supabase admin is not configured");
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = await userIdForSubscription(subscription);
  if (!userId) throw new Error(`No reader found for subscription ${subscription.id}`);

  const item = subscription.items.data[0];
  const periodEnd = item?.current_period_end;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      stripe_subscription_id: subscription.id,
      user_id: userId,
      stripe_customer_id: customerId,
      price_id: item?.price?.id ?? null,
      status: subscription.status,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw new Error(`Saving subscription failed: ${error.message}`);
}
