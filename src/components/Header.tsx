import { Suspense } from "react";
import Link from "next/link";
import { accountPath, localePath, otherLocale, subscribePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { sections } from "@/lib/sections";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/supabase/env";

type Props = {
  lang: Locale;
  dict: Dictionary;
  // Where the language button leads: the same page in the other language.
  alternateHref?: string;
  activeSection?: string;
};

export function Header({ lang, dict, alternateHref, activeSection }: Props) {
  const other = otherLocale(lang);
  return (
    <header className="border-b-4 border-double border-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 text-sm">
        <Link href={alternateHref ?? localePath(other)} hrefLang={other} className="underline-offset-4 hover:underline">
          {dict.nav.languageSwitch}
        </Link>
        <div className="flex items-center gap-4">
          {isSupabaseConfigured && (
            <Suspense fallback={<AccountLink lang={lang} label={dict.nav.signIn} />}>
              <CurrentAccountLink lang={lang} dict={dict} />
            </Suspense>
          )}
          <Link
            href={subscribePath(lang)}
            className="bg-ink px-3 py-1.5 font-semibold text-paper hover:opacity-80"
          >
            {dict.nav.subscribe}
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <Link href={localePath(lang)} aria-label={dict.nav.home}>
          <Logo className="text-5xl sm:text-6xl" />
        </Link>
        <p className="mt-2 font-serif text-sm italic text-muted">{dict.site.tagline}</p>
      </div>
      <nav aria-label={dict.nav.sections} className="border-t border-ink">
        <ul className="mx-auto flex max-w-6xl gap-x-6 overflow-x-auto px-4 py-3 text-sm font-semibold uppercase tracking-wide whitespace-nowrap sm:justify-center">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={localePath(lang, `/${s[lang].slug}`)}
                aria-current={activeSection === s.id ? "page" : undefined}
                className="underline-offset-8 hover:underline aria-[current=page]:underline"
              >
                {s[lang].name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function AccountLink({ lang, label }: { lang: Locale; label: string }) {
  return (
    <Link href={accountPath(lang)} className="underline-offset-4 hover:underline">
      {label}
    </Link>
  );
}

// "Sign in", or the reader's name once they're signed in.
async function CurrentAccountLink({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const user = await getCurrentUser();
  return <AccountLink lang={lang} label={user ? (user.displayName ?? dict.nav.account) : dict.nav.signIn} />;
}
