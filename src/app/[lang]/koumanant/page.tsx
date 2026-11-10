import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { subscribePath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SubscribePage } from "@/components/SubscribePage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").subscribe.title,
  alternates: { languages: perLocale((l) => subscribePath(l)) },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/koumanant">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <SubscribePage lang="br" searchParams={searchParams} />;
}
