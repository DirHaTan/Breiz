import type { Locale } from "@/i18n/config";

// Breton month names (browsers don't all know Breton, so we write them ourselves).
const brMonths = [
  "Genver", "C'hwevrer", "Meurz", "Ebrel", "Mae", "Even",
  "Gouere", "Eost", "Gwengolo", "Here", "Du", "Kerzu",
];

export function formatDate(date: string, lang: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  if (lang === "br") return `${d} a viz ${brMonths[m - 1]} ${y}`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    Date.UTC(y, m - 1, d),
  );
}

export function FormattedDate({ date, lang }: { date: string; lang: Locale }) {
  return <time dateTime={date}>{formatDate(date, lang)}</time>;
}
