"use server";

import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import {
  emailLayout,
  escapeHtml,
  isNewsletterConfigured,
  isValidEmail,
  makeConfirmToken,
  sendEmail,
} from "@/lib/newsletter";
import { failure, readLocale, success, type FormState } from "./shared";

// Newsletter sign-up, step 1: email a confirmation link. The reader is only
// added to the list once they click it (see /api/newsletter/confirm).
export async function signUpForNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const pageLang = readLocale(formData);
  const t = getDictionary(pageLang).newsletter;
  if (!isNewsletterConfigured) return failure(t.error);

  // Hidden field that people never fill in, but spam robots often do.
  if (String(formData.get("website") ?? "")) return success(t.sent);

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) return failure(t.invalidEmail);
  const chosen = String(formData.get("newsletterLang") ?? "");
  const lang: Locale = isLocale(chosen) ? chosen : pageLang;

  // The confirmation email is written in the language the reader chose.
  const n = getDictionary(lang).newsletter;
  const link = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(makeConfirmToken(email, lang))}`;
  const html = emailLayout(
    `<p>${escapeHtml(n.confirmText)}</p>
<p style="text-align:center;margin:28px 0"><a href="${link}" style="background:#111;color:#fff;padding:12px 24px;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold">${escapeHtml(n.confirmButton)}</a></p>
<p style="font-size:13px;color:#555">${escapeHtml(n.confirmIgnore)}</p>`,
  );
  const sent = await sendEmail(email, n.confirmSubject, html);
  return sent ? success(t.sent) : failure(t.error);
}
