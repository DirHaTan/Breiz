import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { CheckoutResultPage } from "@/components/CheckoutResultPage";

// This address only exists in one language ("fr").
export function generateStaticParams() {
  return [{ lang: "fr" }];
}

export const metadata: Metadata = {
  title: getDictionary("fr").billing.cancelTitle,
  robots: { index: false },
};

export default async function Page({ params }: PageProps<"/[lang]/abonnement/annule">) {
  const { lang } = await params;
  if (lang !== "fr") notFound();
  return <CheckoutResultPage lang="fr" result="cancel" />;
}
