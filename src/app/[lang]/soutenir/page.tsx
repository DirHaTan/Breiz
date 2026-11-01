import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { donatePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DonatePage } from "@/components/DonatePage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").donate.title,
  alternates: { languages: { br: donatePath("br"), fr: donatePath("fr") } },
};

export default async function Page({ params }: PageProps<"/[lang]/soutenir">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <DonatePage lang="fr" />;
}
