import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPath } from "@/i18n/config";
import { legalPages } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: legalPages.notices.br.title,
  alternates: { languages: { br: legalPath("notices", "br"), fr: legalPath("notices", "fr") } },
};

export default async function Page({ params }: PageProps<"/[lang]/notennou-lezennel">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <LegalPage kind="notices" lang="br" />;
}
