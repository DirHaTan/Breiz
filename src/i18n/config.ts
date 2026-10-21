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
