// The PayPal donation link (a PayPal "Donate" button link, e.g.
// https://www.paypal.com/donate/?hosted_button_id=XXXX). Set
// NEXT_PUBLIC_PAYPAL_DONATE_URL in Vercel; until it is set, the donation page
// shows a "coming soon" message instead of the button.
export const DONATE_URL = process.env.NEXT_PUBLIC_PAYPAL_DONATE_URL?.trim() ?? "";
