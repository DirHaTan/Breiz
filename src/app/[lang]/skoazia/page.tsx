import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { donatePath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DonatePage } from "@/components/DonatePage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").donate.title,
  alternates: { languages: perLocale((l) => donatePath(l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/skoazia">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <DonatePage lang="br" />;
}
