import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPath, perLocale } from "@/i18n/config";
import { legalPages } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

// This address only exists in one language ("en").
export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: legalPages.terms.en.title,
  alternates: { languages: perLocale((l) => legalPath("terms", l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <LegalPage kind="terms" lang="en" />;
}
