import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { announcePath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AnnouncePage } from "@/components/AnnouncePage";

// This address only exists in one language ("en").
export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: getDictionary("en").announce.title,
  alternates: { languages: perLocale((l) => announcePath(l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/send-an-announcement">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <AnnouncePage lang="en" />;
}
