import { localePath, type Locale } from "@/i18n/config";
import { getSection } from "@/lib/sections";

// The departments of Brittany, used to sort articles in the Breiz section.
export const departments = [
  { id: "aodou-an-arvor", br: { name: "Aodou-an-Arvor", slug: "aodou-an-arvor" }, fr: { name: "Côtes-d'Armor", slug: "cotes-d-armor" } },
  { id: "penn-ar-bed", br: { name: "Penn-ar-Bed", slug: "penn-ar-bed" }, fr: { name: "Finistère", slug: "finistere" } },
  { id: "il-ha-gwilen", br: { name: "Il-ha-Gwilen", slug: "il-ha-gwilen" }, fr: { name: "Ille-et-Vilaine", slug: "ille-et-vilaine" } },
  { id: "mor-bihan", br: { name: "Mor-Bihan", slug: "mor-bihan" }, fr: { name: "Morbihan", slug: "morbihan" } },
  { id: "liger-atlantel", br: { name: "Liger-Atlantel", slug: "liger-atlantel" }, fr: { name: "Loire-Atlantique", slug: "loire-atlantique" } },
] as const;

export type Department = (typeof departments)[number];
export type DepartmentId = Department["id"];

// The section whose articles can have a department (also written in the
// article query in src/lib/articles.ts).
export const DEPARTMENT_SECTION = "breiz";

// The word in department addresses: /breiz/departamant/penn-ar-bed, /fr/bretagne/departement/finistere.
export const departmentSegment = { br: "departamant", fr: "departement" } as const;

export function getDepartmentBySlug(lang: Locale, slug: string): Department | undefined {
  return departments.find((d) => d[lang].slug === slug);
}

// Address of a department page, e.g. "/breiz/departamant/penn-ar-bed".
export function departmentPath(lang: Locale, department: Department): string {
  const section = getSection(DEPARTMENT_SECTION)!;
  return localePath(lang, `/${section[lang].slug}/${departmentSegment[lang]}/${department[lang].slug}`);
}
