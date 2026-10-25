import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { syncSubscription } from "@/lib/subscriptions";
import { supabaseAdmin } from "@/supabase/admin";

// Stripe calls this address after payments, renewals, cancellations and
// failed payments. We check Stripe's signature, then copy the subscription's
// current state into Supabase.

const HANDLED = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

function subscriptionIdOf(event: Stripe.Event): string | null {
  const object = event.data.object as unknown as Record<string, unknown>;
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) return null;
      return typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.parent?.subscription_details?.subscription;
      return typeof sub === "string" ? sub : (sub?.id ?? null);
    }
    default:
      return typeof object.id === "string" ? object.id : null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret || !supabaseAdmin) {
    return new Response("Stripe is not configured", { status: 503 });
  }

  // 1. Check that the message really comes from Stripe.
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await request.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (!HANDLED.has(event.type)) return Response.json({ received: true, ignored: true });

  // 2. Skip events we already handled (Stripe may send the same one twice).
  const seen = await supabaseAdmin.from("stripe_events").select("id").eq("id", event.id).maybeSingle();
  if (seen.data) return Response.json({ received: true, duplicate: true });

  // 3. Copy the subscription's latest state from Stripe into Supabase.
  try {
    const subscriptionId = subscriptionIdOf(event);
    if (subscriptionId) await syncSubscription(subscriptionId);
  } catch (error) {
    // A 500 makes Stripe try again later. Only the message is logged, never keys.
    console.error(`Stripe webhook ${event.type} (${event.id}) failed:`, error instanceof Error ? error.message : "unknown error");
    return new Response("Webhook handling failed", { status: 500 });
  }

  // 4. Remember the event, so a repeat is ignored.
  await supabaseAdmin.from("stripe_events").upsert({ id: event.id, type: event.type }, { onConflict: "id", ignoreDuplicates: true });
  return Response.json({ received: true });
}
