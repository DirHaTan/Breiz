import Link from "next/link";
import { subscribePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// Shown under the start of every article to readers who aren't subscribed.
export function Paywall({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <aside className="relative mt-2 border-2 border-ink p-6 text-center">
      <div className="pointer-events-none absolute inset-x-0 -top-14 h-14 bg-gradient-to-b from-transparent to-paper" />
      <h2 className="font-serif text-2xl font-bold">{dict.paywall.title}</h2>
      <p className="mt-2">{dict.paywall.text}</p>
      <p className="mt-4 font-serif text-3xl font-black">{dict.paywall.price}</p>
      <Link
        href={subscribePath(lang)}
        className="mt-4 inline-block bg-ink px-6 py-3 font-semibold text-paper hover:opacity-80"
      >
        {dict.paywall.button}
      </Link>
      <p className="mt-3 text-sm text-muted">{dict.paywall.already}</p>
    </aside>
  );
}
