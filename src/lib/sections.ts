import type { Locale } from "@/i18n/config";

// The seven sections of the site, with their name and web address in each language.
export const sections = [
  { id: "keleier", br: { name: "Keleier", slug: "keleier" }, fr: { name: "Actualités", slug: "actualites" } },
  { id: "breiz", br: { name: "Breiz", slug: "breiz" }, fr: { name: "Bretagne", slug: "bretagne" } },
  { id: "frans", br: { name: "Frans", slug: "frans" }, fr: { name: "France", slug: "france" } },
  { id: "bed", br: { name: "Bed", slug: "bed" }, fr: { name: "Monde", slug: "monde" } },
  { id: "lennegez", br: { name: "Lennegez", slug: "lennegez" }, fr: { name: "Littérature", slug: "litterature" } },
  { id: "kevredigez", br: { name: "Kevredigez", slug: "kevredigez" }, fr: { name: "Société", slug: "societe" } },
] as const;

export type Section = (typeof sections)[number];
export type SectionId = Section["id"];

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionBySlug(lang: Locale, slug: string): Section | undefined {
  return sections.find((s) => s[lang].slug === slug);
}
