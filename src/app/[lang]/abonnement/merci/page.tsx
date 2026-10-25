import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { CheckoutResultPage } from "@/components/CheckoutResultPage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").billing.successTitle,
  robots: { index: false },
};

export default async function Page({ params, searchParams }: PageProps<"/[lang]/abonnement/merci">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <CheckoutResultPage lang="fr" result="success" searchParams={searchParams} />;
}
