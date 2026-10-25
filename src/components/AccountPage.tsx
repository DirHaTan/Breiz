import { Suspense } from "react";
import Link from "next/link";
import { accountPath, moderationPath, otherLocale, safeNextPath, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/supabase/env";
import { signOut } from "@/app/actions/account";
import { Header } from "@/components/Header";
import { SignInForm } from "@/components/account/SignInForm";
import { ProfileForm } from "@/components/account/ProfileForm";
import { SubscriptionPanel } from "@/components/account/SubscriptionPanel";

type SearchParams = Promise<{ next?: string | string[]; error?: string | string[] }>;

// The account page: a sign-in form, or (once signed in) the reader's name and a sign-out button.
export function AccountPage({ lang, searchParams }: { lang: Locale; searchParams: SearchParams }) {
  const dict = getDictionary(lang);
  return (
    <>
      <Header lang={lang} dict={dict} alternateHref={accountPath(otherLocale(lang))} />
      <main className="mx-auto max-w-xl px-4 py-12">
        {isSupabaseConfigured ? (
          <Suspense fallback={<h1 className="font-serif text-4xl font-black">{dict.account.title}</h1>}>
            <AccountContent lang={lang} dict={dict} searchParams={searchParams} />
          </Suspense>
        ) : (
          <>
            <h1 className="font-serif text-4xl font-black">{dict.account.title}</h1>
            <p className="mt-4 text-muted">{dict.account.notConfigured}</p>
          </>
        )}
      </main>
    </>
  );
}

async function AccountContent({ lang, dict, searchParams }: { lang: Locale; dict: Dictionary; searchParams: SearchParams }) {
  const t = dict.account;
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (!user) {
    return (
      <>
        <h1 className="font-serif text-4xl font-black">{t.signInTitle}</h1>
        {params.error && <p className="mt-4 font-semibold text-red-700">{t.linkError}</p>}
        <p className="mt-4 text-muted">{t.signInIntro}</p>
        <SignInForm lang={lang} next={safeNextPath(params.next)} labels={{ email: t.emailLabel, send: t.sendLink }} />
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-4xl font-black">{t.title}</h1>
      <p className="mt-4">
        {t.signedInAs} <strong>{user.email}</strong>
      </p>
      <ProfileForm lang={lang} displayName={user.displayName} labels={{ name: t.displayName, save: t.save }} />
      <SubscriptionPanel lang={lang} dict={dict} userId={user.id} />
      {user.isModerator && (
        <p className="mt-8">
          <Link href={moderationPath(lang)} className="font-semibold underline">
            {t.moderation} →
          </Link>
        </p>
      )}
      <form action={signOut} className="mt-10 border-t border-ink pt-6">
        <input type="hidden" name="lang" value={lang} />
        <button className="border-2 border-ink px-5 py-2 font-semibold hover:bg-ink hover:text-paper">{t.signOut}</button>
      </form>
    </>
  );
}
