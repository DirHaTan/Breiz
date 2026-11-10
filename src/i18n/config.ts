// The languages of the site. Breton is the default and lives at "/",
// French lives under "/fr" and English under "/en".
export const locales = ["br", "fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "br";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// The other languages, in the site's order (for the language links in the header).
export function otherLocales(lang: Locale): Locale[] {
  return locales.filter((l) => l !== lang);
}

// Each language's name, written in that language (used for the language links).
export const languageNames: Record<Locale, string> = { br: "Brezoneg", fr: "Français", en: "English" };

// One value per language, e.g. the address of the same page in each language
// (for search engines' "alternates").
export function perLocale<T>(fn: (lang: Locale) => T): Record<Locale, T> {
  return Object.fromEntries(locales.map((l) => [l, fn(l)])) as Record<Locale, T>;
}

// Builds a link for a language: localePath("br", "/keleier") -> "/keleier",
// localePath("fr", "/actualites") -> "/fr/actualites".
export function localePath(lang: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  if (lang === defaultLocale) return clean || "/";
  return `/${lang}${clean}`;
}

// Value for the <html lang="..."> attribute.
export const htmlLang: Record<Locale, string> = { br: "br", fr: "fr", en: "en" };

// Language and region for Facebook, X and other sharing previews.
export const ogLocale: Record<Locale, string> = { br: "br_FR", fr: "fr_FR", en: "en_GB" };

// Stripe's payment and account pages have no Breton, so Breton readers get French.
export const stripeLocale: Record<Locale, "fr" | "en"> = { br: "fr", fr: "fr", en: "en" };

// Addresses of the pages that have a different name in each language.
const pagePaths = {
  subscribe: { br: "/koumanant", fr: "/abonnement", en: "/subscribe" },
  account: { br: "/kont", fr: "/compte", en: "/account" },
  donate: { br: "/skoazia", fr: "/soutenir", en: "/support" },
  announce: { br: "/kas-eur-gemennadenn", fr: "/envoyer-une-annonce", en: "/send-an-announcement" },
  checkoutSuccess: { br: "/koumanant/trugarez", fr: "/abonnement/merci", en: "/subscribe/thank-you" },
  checkoutCancel: { br: "/koumanant/nullet", fr: "/abonnement/annule", en: "/subscribe/cancelled" },
} as const satisfies Record<string, Record<Locale, string>>;

// The subscription page has a different address in each language.
export function subscribePath(lang: Locale): string {
  return localePath(lang, pagePaths.subscribe[lang]);
}

// The account page (sign in, name, sign out).
export function accountPath(lang: Locale): string {
  return localePath(lang, pagePaths.account[lang]);
}

export function moderationPath(lang: Locale): string {
  return localePath(lang, "/moderation");
}

// Only allow going back to a page of this site after signing in.
export function safeNextPath(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : undefined;
}

// The donation page.
export function donatePath(lang: Locale): string {
  return localePath(lang, pagePaths.donate[lang]);
}

// The page explaining how to send a free announcement.
export function announcePath(lang: Locale): string {
  return localePath(lang, pagePaths.announce[lang]);
}

// The legal pages: /notennou-lezennel, /prevezded and /divizou-gwerza in Breton,
// /fr/mentions-legales, /fr/confidentialite and /fr/cgv in French,
// /en/legal-notice, /en/privacy and /en/terms in English.
export function legalPath(kind: "notices" | "privacy" | "terms", lang: Locale): string {
  const slugs = {
    notices: { br: "notennou-lezennel", fr: "mentions-legales", en: "legal-notice" },
    privacy: { br: "prevezded", fr: "confidentialite", en: "privacy" },
    terms: { br: "divizou-gwerza", fr: "cgv", en: "terms" },
  };
  return localePath(lang, `/${slugs[kind][lang]}`);
}

// After Stripe Checkout: thank-you and cancelled pages.
export function checkoutSuccessPath(lang: Locale): string {
  return localePath(lang, pagePaths.checkoutSuccess[lang]);
}
export function checkoutCancelPath(lang: Locale): string {
  return localePath(lang, pagePaths.checkoutCancel[lang]);
}
