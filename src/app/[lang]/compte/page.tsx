import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountPath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AccountPage } from "@/components/AccountPage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").account.title,
  robots: { index: false },
  alternates: { languages: { br: accountPath("br"), fr: accountPath("fr") } },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/compte">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <AccountPage lang="fr" searchParams={searchParams} />;
}
