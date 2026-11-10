import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountPath, perLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AccountPage } from "@/components/AccountPage";

// This address only exists in one language ("en").
export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: getDictionary("en").account.title,
  robots: { index: false },
  alternates: { languages: perLocale((l) => accountPath(l)) },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/account">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <AccountPage lang="en" searchParams={searchParams} />;
}
