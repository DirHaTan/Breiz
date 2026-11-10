import type { Metadata } from "next";
import { perLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getSection, getSectionBySlug } from "@/lib/sections";
import { DEPARTMENT_SECTION, departmentPath, departments, getDepartmentBySlug } from "@/lib/departments";
import { SectionListing } from "@/components/SectionListing";

// Department pages of the Breiz section, in English: /en/brittany/department/<department>.
// The Breton and French versions are in the folders "departamant" and "departement".
const LANG = "en";

export function generateStaticParams() {
  const section = getSection(DEPARTMENT_SECTION)!;
  return departments.map((d) => ({ lang: LANG, section: section[LANG].slug, department: d[LANG].slug }));
}

async function load(params: PageProps<"/[lang]/[section]/department/[department]">["params"]) {
  const { lang, section: sectionSlug, department: slug } = await params;
  if (lang !== LANG) return undefined;
  const section = getSectionBySlug(LANG, sectionSlug);
  const department = getDepartmentBySlug(LANG, slug);
  if (section?.id !== DEPARTMENT_SECTION || !department) return undefined;
  return { section, department };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]/department/[department]">): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { section, department } = data;
  return {
    title: `${department[LANG].name} – ${section[LANG].name}`,
    alternates: {
      canonical: departmentPath(LANG, department),
      languages: perLocale((l) => departmentPath(l, department)),
    },
  };
}

export default async function DepartmentPage({ params }: PageProps<"/[lang]/[section]/department/[department]">) {
  const data = await load(params);
  if (!data) notFound();
  return <SectionListing lang={LANG} section={data.section} department={data.department} />;
}
