import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { announcePath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AnnouncePage } from "@/components/AnnouncePage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").announce.title,
  alternates: { languages: perLocale((l) => announcePath(l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/kas-eur-gemennadenn">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <AnnouncePage lang="br" />;
}
