"use client";

import { useActionState, useState } from "react";
import { sendSignInLink } from "@/app/actions/account";
import { FormMessage } from "@/components/FormMessage";
import type { Locale } from "@/i18n/config";

type Props = { lang: Locale; next?: string; labels: { email: string; send: string } };

export function SignInForm({ lang, next, labels }: Props) {
  const [state, action, pending] = useActionState(sendSignInLink, null);
  // Kept in React state so the address stays in the box after sending.
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="lang" value={lang} />
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block text-sm font-semibold" htmlFor="email">
        {labels.email}
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 border-2 border-ink px-3 py-2"
        />
        <button disabled={pending} className="bg-ink px-5 py-2 font-semibold text-paper disabled:opacity-50">
          {labels.send}
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
