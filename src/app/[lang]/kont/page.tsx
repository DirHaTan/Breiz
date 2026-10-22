import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { accountPath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AccountPage } from "@/components/AccountPage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").account.title,
  robots: { index: false },
  alternates: { languages: { br: accountPath("br"), fr: accountPath("fr") } },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/kont">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <AccountPage lang="br" searchParams={searchParams} />;
}
