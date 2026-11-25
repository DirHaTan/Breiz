import type { NextRequest } from "next/server";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { articlePath, getLatestArticles, type LocalizedArticle } from "@/lib/articles";
import { getSection } from "@/lib/sections";
import { SITE_URL } from "@/lib/site";
import { formatDate } from "@/components/FormattedDate";
import { createDraftBroadcast, emailLayout, escapeHtml, isNewsletterConfigured } from "@/lib/newsletter";

// Every Monday morning (see vercel.json), Vercel calls this address. For each
// language it gathers the articles of the past 7 days and creates a DRAFT
// newsletter in Resend. Nothing is sent: the editor checks each draft in
// Resend (Broadcasts) and clicks Send.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isNewsletterConfigured) return Response.json({ skipped: "newsletter not configured" });

  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const today = new Date().toISOString();
  const results: Record<string, string> = {};
  for (const lang of locales) {
    const week = (await getLatestArticles(lang)).filter((a) => Date.parse(a.date) >= since);
    if (week.length === 0) {
      results[lang] = "no new articles";
      continue;
    }
    const t = getDictionary(lang).newsletter;
    const subject = `${t.digestSubject} – ${formatDate(today, lang)}`;
    const id = await createDraftBroadcast(lang, `${t.digestSubject} (${lang}) ${today.slice(0, 10)}`, subject, digestHtml(lang, week));
    results[lang] = id ? `draft ${id}` : "failed";
  }
  return Response.json(results);
}

function digestHtml(lang: Locale, articles: LocalizedArticle[]) {
  const t = getDictionary(lang).newsletter;
  const items = articles
    .toReversed() // oldest first, as the week unfolded
    .map((a) => {
      const url = `${SITE_URL}${articlePath(a)}`;
      const section = getSection(a.section)![lang].name;
      return `<tr><td style="padding:14px 0;border-bottom:1px solid #ddd">
<div style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">${escapeHtml(section)}</div>
<a href="${url}" style="display:block;margin:4px 0;font-size:20px;font-weight:bold;color:#111;text-decoration:none">${escapeHtml(a.title)}</a>
<div style="color:#444">${escapeHtml(a.excerpt)}</div>
<a href="${url}" style="display:inline-block;margin-top:6px;font-family:Arial,sans-serif;font-size:13px;color:#111">${escapeHtml(t.digestRead)} →</a>
</td></tr>`;
    })
    .join("");
  // {{{RESEND_UNSUBSCRIBE_URL}}} is replaced by Resend with each reader's own link.
  return emailLayout(
    `<p>${escapeHtml(t.digestIntro)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>`,
    `<a href="${SITE_URL}" style="color:#555">keleierbreiz.fr</a> · <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#555">${escapeHtml(t.unsubscribe)}</a>`,
  );
}
