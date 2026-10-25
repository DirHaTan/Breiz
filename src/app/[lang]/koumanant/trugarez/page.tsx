import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { CheckoutResultPage } from "@/components/CheckoutResultPage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").billing.successTitle,
  robots: { index: false },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/koumanant/trugarez">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <CheckoutResultPage lang="br" result="success" searchParams={searchParams} />;
}
