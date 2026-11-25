import type { NextRequest } from "next/server";
import { defaultLocale, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import { addSubscriber, emailLayout, escapeHtml, isNewsletterConfigured, readConfirmToken } from "@/lib/newsletter";

// Newsletter sign-up, step 2: the reader clicked the link in the confirmation
// email. The signed link proves they own the address; we add them to the
// Resend segment for the language they chose and show a short thank-you page.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const reader = isNewsletterConfigured ? readConfirmToken(token) : null;
  if (!reader) return page(defaultLocale, false);
  const ok = await addSubscriber(reader.email, reader.lang);
  return page(reader.lang, ok);
}

function page(lang: Locale, ok: boolean) {
  const n = getDictionary(lang).newsletter;
  const home = `${SITE_URL}${localePath(lang, "/")}`;
  const body = ok
    ? `<h1 style="font-size:26px;margin:0 0 12px">${escapeHtml(n.confirmedTitle)}</h1><p>${escapeHtml(n.confirmedText)}</p>`
    : `<p>${escapeHtml(n.invalidLink)}</p>`;
  const html = emailLayout(`${body}<p style="margin-top:24px"><a href="${home}" style="color:#111;font-weight:bold">${escapeHtml(n.back)}</a></p>`)
    .replace("<html>", `<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(n.title)}</title></head>`);
  return new Response(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
