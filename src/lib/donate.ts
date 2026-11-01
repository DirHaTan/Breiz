// The PayPal donation link (payment link where the donor sets the amount).
// NEXT_PUBLIC_PAYPAL_DONATE_URL in Vercel can override it; if both were empty,
// the donation page would show a "coming soon" message instead of the button.
export const DONATE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL?.trim() || "https://www.paypal.com/ncp/payment/5533UCBBT99E2";
