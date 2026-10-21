import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { subscribePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SubscribePage } from "@/components/SubscribePage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").subscribe.title,
  alternates: { languages: { br: subscribePath("br"), fr: subscribePath("fr") } },
};

export default async function Page({ params }: PageProps<"/[lang]/abonnement">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <SubscribePage lang="fr" />;
}
