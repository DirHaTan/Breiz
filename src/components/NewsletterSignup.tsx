"use client";

import { useActionState } from "react";
import { signUpForNewsletter } from "@/app/actions/newsletter";
import { FormMessage } from "@/components/FormMessage";
import { languageNames, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// "Lizer-keleier": email + language. Sends a confirmation link; the reader is
// added to the list only after clicking it.
export function NewsletterSignup({ lang, labels }: { lang: Locale; labels: Dictionary["newsletter"] }) {
  const [state, action, pending] = useActionState(signUpForNewsletter, null);
  return (
    <section aria-labelledby="newsletter-title" className="mt-8 border-2 border-ink p-4">
      <h2 id="newsletter-title" className="text-xs font-bold uppercase tracking-widest">
        {labels.title}
      </h2>
      <p className="mt-2 font-serif">{labels.text}</p>
      {state?.ok ? (
        <FormMessage state={state} />
      ) : (
        <form action={action} className="mt-3 space-y-3">
          <input type="hidden" name="lang" value={lang} />
          {/* Left empty by people; spam robots fill it in. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <label className="block text-sm">
            <span className="sr-only">{labels.email}</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={labels.email}
              className="w-full border border-ink bg-paper px-3 py-2"
            />
          </label>
          <fieldset className="text-sm">
            <legend className="font-semibold">{labels.language}</legend>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {locales.map((l) => (
                <label key={l} className="inline-flex items-center gap-1">
                  <input type="radio" name="newsletterLang" value={l} defaultChecked={l === lang} />
                  {languageNames[l]}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" disabled={pending} className="bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-60">
            {labels.submit}
          </button>
          <p className="text-xs text-muted">{labels.privacy}</p>
          <FormMessage state={state} />
        </form>
      )}
    </section>
  );
}
