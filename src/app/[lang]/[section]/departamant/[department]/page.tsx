import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection, getSectionBySlug } from "@/lib/sections";
import { DEPARTMENT_SECTION, departmentPath, departments, getDepartmentBySlug } from "@/lib/departments";
import { SectionListing } from "@/components/SectionListing";

// Department pages of the Breiz section, in Breton: /breiz/departamant/<department>.
// The French version is in the folder "departement".
const LANG = "br";

export function generateStaticParams() {
  const section = getSection(DEPARTMENT_SECTION)!;
  return departments.map((d) => ({ lang: LANG, section: section[LANG].slug, department: d[LANG].slug }));
}

async function load(params: PageProps<"/[lang]/[section]/departamant/[department]">["params"]) {
  const { lang, section: sectionSlug, department: slug } = await params;
  if (lang !== LANG) return undefined;
  const section = getSectionBySlug(LANG, sectionSlug);
  const department = getDepartmentBySlug(LANG, slug);
  if (section?.id !== DEPARTMENT_SECTION || !department) return undefined;
  return { section, department };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]/departamant/[department]">): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { section, department } = data;
  return {
    title: `${department[LANG].name} – ${section[LANG].name}`,
    alternates: {
      canonical: departmentPath(LANG, department),
      languages: { br: departmentPath("br", department), fr: departmentPath("fr", department) },
    },
  };
}

export default async function DepartmentPage({ params }: PageProps<"/[lang]/[section]/departamant/[department]">) {
  const data = await load(params);
  if (!data) notFound();
  return <SectionListing lang={LANG} section={data.section} department={data.department} />;
}
