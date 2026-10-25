import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { CheckoutResultPage } from "@/components/CheckoutResultPage";

// This address only exists in one language ("br").
export function generateStaticParams() {
  return [{ lang: "br" }];
}

export const metadata: Metadata = {
  title: getDictionary("br").billing.cancelTitle,
  robots: { index: false },
};

export default async function Page({ params }: PageProps<"/[lang]/koumanant/nullet">) {
  const { lang } = await params;
  if (lang !== "br") notFound();
  return <CheckoutResultPage lang="br" result="cancel" />;
}
