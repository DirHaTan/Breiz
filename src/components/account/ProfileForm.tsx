"use client";

import { useActionState, useState } from "react";
import { saveDisplayName } from "@/app/actions/account";
import { FormMessage } from "@/components/FormMessage";
import type { Locale } from "@/i18n/config";

type Props = { lang: Locale; displayName: string | null; labels: { name: string; save: string } };

export function ProfileForm({ lang, displayName, labels }: Props) {
  const [state, action, pending] = useActionState(saveDisplayName, null);
  const [name, setName] = useState(displayName ?? "");
  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="lang" value={lang} />
      <label className="block text-sm font-semibold" htmlFor="displayName">
        {labels.name}
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id="displayName"
          name="displayName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={40}
          className="min-w-0 flex-1 border-2 border-ink px-3 py-2"
        />
        <button disabled={pending} className="bg-ink px-5 py-2 font-semibold text-paper disabled:opacity-50">
          {labels.save}
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
