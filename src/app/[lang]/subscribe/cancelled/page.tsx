import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { CheckoutResultPage } from "@/components/CheckoutResultPage";

// This address only exists in one language ("en").
export function generateStaticParams() {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: getDictionary("en").billing.cancelTitle,
  robots: { index: false },
};

export default async function Page({ params }: PageProps<"/[lang]/subscribe/cancelled">) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <CheckoutResultPage lang="en" result="cancel" />;
}
