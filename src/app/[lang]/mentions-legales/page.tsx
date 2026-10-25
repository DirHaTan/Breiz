import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalPath } from "@/i18n/config";
import { legalPages } from "@/content/legal";
import { LegalPage } from "@/components/LegalPage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: legalPages.notices.fr.title,
  alternates: { languages: { br: legalPath("notices", "br"), fr: legalPath("notices", "fr") } },
};

export default async function Page({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <LegalPage kind="notices" lang="fr" />;
}
