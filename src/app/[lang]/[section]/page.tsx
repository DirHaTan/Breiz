import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, localePath, locales } from "@/i18n/config";
import { getSectionBySlug, sections } from "@/lib/sections";
import { SectionListing } from "@/components/SectionListing";

export function generateStaticParams() {
  return locales.flatMap((lang) => sections.map((s) => ({ lang, section: s[lang].slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[section]">): Promise<Metadata> {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) return {};
  const section = getSectionBySlug(lang, slug);
  if (!section) return {};
  return {
    title: section[lang].name,
    alternates: {
      canonical: localePath(lang, `/${section[lang].slug}`),
      languages: {
        br: localePath("br", `/${section.br.slug}`),
        fr: localePath("fr", `/${section.fr.slug}`),
      },
    },
  };
}

export default async function SectionPage({ params }: PageProps<"/[lang]/[section]">) {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) notFound();
  const section = getSectionBySlug(lang, slug);
  if (!section) notFound();
  return <SectionListing lang={lang} section={section} />;
}
