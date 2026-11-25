import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Locale } from "@/i18n/config";

// The weekly newsletter ("Lizer-keleier"), sent with Resend Broadcasts.
//
// Readers sign up with their email and a language, confirm by clicking a link
// (double opt-in), and are then added to that language's Segment in Resend.
// Every Monday a draft is prepared for each language; the editor checks it in
// Resend and clicks Send. Unsubscribing is handled by Resend's own link.
//
// Settings (in Vercel): RESEND_API_KEY, NEWSLETTER_FROM, NEWSLETTER_SECRET,
// RESEND_SEGMENT_BR, RESEND_SEGMENT_FR, RESEND_SEGMENT_EN, CRON_SECRET.
// Until they are all set, the sign-up form is not shown.

const API = "https://api.resend.com";

const segmentEnv: Record<Locale, string | undefined> = {
  br: process.env.RESEND_SEGMENT_BR,
  fr: process.env.RESEND_SEGMENT_FR,
  en: process.env.RESEND_SEGMENT_EN,
};

export const isNewsletterConfigured = Boolean(
  process.env.RESEND_API_KEY &&
    process.env.NEWSLETTER_FROM &&
    process.env.NEWSLETTER_SECRET &&
    segmentEnv.br &&
    segmentEnv.fr &&
    segmentEnv.en,
);

export const newsletterFrom = () => process.env.NEWSLETTER_FROM!;
export const segmentFor = (lang: Locale) => segmentEnv[lang]!;

export const isValidEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ---- Confirmation links -------------------------------------------------
// The link carries the email and language, signed with NEWSLETTER_SECRET, so
// nothing has to be stored before the reader confirms. Valid for 7 days.

const WEEK = 7 * 24 * 60 * 60 * 1000;

function sign(payload: string): string {
  return createHmac("sha256", process.env.NEWSLETTER_SECRET!).update(payload).digest("base64url");
}

export function makeConfirmToken(email: string, lang: Locale, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ e: email, l: lang, x: now + WEEK })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readConfirmToken(token: string, now = Date.now()): { email: string; lang: Locale } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e?: unknown; l?: unknown; x?: unknown };
    if (typeof data.e !== "string" || typeof data.x !== "number" || data.x < now) return null;
    if (data.l !== "br" && data.l !== "fr" && data.l !== "en") return null;
    return { email: data.e, lang: data.l };
  } catch {
    return null;
  }
}

// ---- Resend API ------------------------------------------------------------

async function resend(path: string, init: { method: string; body?: unknown }) {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  return { ok: res.ok, status: res.status, data };
}

export async function sendEmail(to: string, subject: string, html: string) {
  const r = await resend("/emails", { method: "POST", body: { from: newsletterFrom(), to: [to], subject, html } });
  if (!r.ok) console.error("Newsletter email failed:", r.status, r.data);
  return r.ok;
}

// Adds (or re-subscribes) a confirmed reader to their language's segment.
export async function addSubscriber(email: string, lang: Locale) {
  const segment = segmentFor(lang);
  const created = await resend("/contacts", {
    method: "POST",
    body: { email, unsubscribed: false, segments: [{ id: segment }] },
  });
  if (created.ok) return true;
  // Already a contact (e.g. signed up before, or unsubscribed): subscribe again
  // and make sure they are in the chosen language's segment.
  const id = encodeURIComponent(email);
  const updated = await resend(`/contacts/${id}`, { method: "PATCH", body: { unsubscribed: false } });
  const added = await resend(`/contacts/${id}/segments/${segment}`, { method: "POST" });
  if (!updated.ok || (!added.ok && added.status !== 409)) {
    console.error("Newsletter subscribe failed:", created.status, created.data, updated.status, added.status, added.data);
    return false;
  }
  return true;
}

// Creates a draft broadcast (not sent) for the editor to check and send.
export async function createDraftBroadcast(lang: Locale, name: string, subject: string, html: string) {
  const r = await resend("/broadcasts", {
    method: "POST",
    body: { segment_id: segmentFor(lang), from: newsletterFrom(), subject, html, name, send: false },
  });
  if (!r.ok) console.error("Newsletter draft failed:", lang, r.status, r.data);
  return r.ok ? (r.data?.id as string | undefined) ?? null : null;
}

// ---- Email layout ------------------------------------------------------------

export const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A simple, email-safe page: the site's name, then the content.
export function emailLayout(content: string, footer = "") {
  return `<!doctype html><html><body style="margin:0;background:#f5f3ee;font-family:Georgia,'Times New Roman',serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #111">
<tr><td style="padding:20px 24px;border-bottom:3px double #111;text-align:center;font-size:22px;font-weight:bold;letter-spacing:2px">KELEIER BREIZ HAG AR BED</td></tr>
<tr><td style="padding:24px;font-size:16px;line-height:1.5">${content}</td></tr>
${footer ? `<tr><td style="padding:16px 24px;border-top:1px solid #111;font-family:Arial,sans-serif;font-size:12px;color:#555">${footer}</td></tr>` : ""}
</table></td></tr></table></body></html>`;
}
