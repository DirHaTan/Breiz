import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { announcePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AnnouncePage } from "@/components/AnnouncePage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").announce.title,
  alternates: { languages: { br: announcePath("br"), fr: announcePath("fr") } },
};

export default async function Page({ params }: PageProps<"/[lang]/envoyer-une-annonce">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <AnnouncePage lang="fr" />;
}
