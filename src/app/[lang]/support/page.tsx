import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { donatePath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { DonatePage } from "@/components/DonatePage";

// This address only exists in one language ("en").
export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: getDictionary("en").donate.title,
  alternates: { languages: perLocale((l) => donatePath(l)) },
};

export default async function Page({ params }: PageProps<"/[lang]/support">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <DonatePage lang="en" />;
}
