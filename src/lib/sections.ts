import type { Locale } from "@/i18n/config";

// The sections of the site, with their name and web address in each language.
export const sections = [
  { id: "nevezentiou", br: { name: "Nevezentiou", slug: "nevezentiou" }, fr: { name: "Actualités", slug: "actualites" } },
  { id: "breiz", br: { name: "Breiz", slug: "breiz" }, fr: { name: "Bretagne", slug: "bretagne" } },
  { id: "deskadurez", br: { name: "Deskadurez", slug: "deskadurez" }, fr: { name: "Éducation", slug: "education" } },
  { id: "frans", br: { name: "Frans", slug: "frans" }, fr: { name: "France", slug: "france" } },
  { id: "bed", br: { name: "Bed", slug: "bed" }, fr: { name: "Monde", slug: "monde" } },
  { id: "lennegez", br: { name: "Lennegez", slug: "lennegez" }, fr: { name: "Littérature", slug: "litterature" } },
  { id: "kevredigez", br: { name: "Kevredigez", slug: "kevredigez" }, fr: { name: "Société", slug: "societe" } },
  { id: "sport", br: { name: "Sport", slug: "sport" }, fr: { name: "Sport", slug: "sport" } },
  { id: "istor", br: { name: "Istor", slug: "istor" }, fr: { name: "Histoire", slug: "histoire" } },
  { id: "sevenadur", br: { name: "Sevenadur", slug: "sevenadur" }, fr: { name: "Culture", slug: "culture" } },
  {
    id: "embannit-ganeomp",
    br: { name: "Embannit ganeomp", slug: "embannit-ganeomp" },
    fr: { name: "Annonces", slug: "annonces" },
  },
] as const;

export type Section = (typeof sections)[number];

// Free community announcements (concerts, fest-noz, workshops…). Choosing this
// section in the editor ticks "Pennad digoust" automatically.
export const ANNOUNCEMENTS_SECTION = "embannit-ganeomp";
export type SectionId = Section["id"];

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionBySlug(lang: Locale, slug: string): Section | undefined {
  return sections.find((s) => s[lang].slug === slug);
}
