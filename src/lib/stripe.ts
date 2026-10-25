import "server-only";
import Stripe from "stripe";

// The Stripe connection, on the server only. The secret key comes from
// STRIPE_SECRET_KEY in Vercel; it is never sent to the browser or logged.
const secretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = secretKey ? new Stripe(secretKey) : null;

export type Plan = "monthly" | "yearly";

// The two prices of "Koumanant Keleier Breiz", set in Vercel.
export function priceIdFor(plan: Plan): string | undefined {
  return plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY;
}

export function planForPrice(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_YEARLY) return "yearly";
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return "monthly";
  return null;
}
