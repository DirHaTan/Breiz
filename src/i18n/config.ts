// The two languages of the site. Breton is the default and lives at "/",
// French lives under "/fr".
export const locales = ["br", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "br";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(lang: Locale): Locale {
  return lang === "br" ? "fr" : "br";
}

// Builds a link for a language: localePath("br", "/keleier") -> "/keleier",
// localePath("fr", "/actualites") -> "/fr/actualites".
export function localePath(lang: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  if (lang === defaultLocale) return clean || "/";
  return `/${lang}${clean}`;
}

// Value for the <html lang="..."> attribute.
export const htmlLang: Record<Locale, string> = { br: "br", fr: "fr" };

// The subscription page has a different address in each language.
export function subscribePath(lang: Locale): string {
  return localePath(lang, lang === "br" ? "/koumanant" : "/abonnement");
}

// The account page (sign in, name, sign out).
export function accountPath(lang: Locale): string {
  return localePath(lang, lang === "br" ? "/kont" : "/compte");
}

export function moderationPath(lang: Locale): string {
  return localePath(lang, "/moderation");
}

// Only allow going back to a page of this site after signing in.
export function safeNextPath(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : undefined;
}

// The page explaining how to send a free announcement.
export function announcePath(lang: Locale): string {
  return localePath(lang, lang === "br" ? "/kas-eur-gemennadenn" : "/envoyer-une-annonce");
}
