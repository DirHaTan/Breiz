import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPath, perLocale } from "@/i18n/config";
import { legalPages } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: legalPages.privacy.br.title,
  alternates: { languages: perLocale((l) => legalPath("privacy", l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/prevezded">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <LegalPage kind="privacy" lang="br" />;
}
