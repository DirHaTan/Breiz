"use client";

import { useActionState, useState } from "react";
import { postComment } from "@/app/actions/comments";
import { FormMessage } from "@/components/FormMessage";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
  articleId: string;
  // Asked only before a reader's very first comment.
  needsName: boolean;
  labels: { placeholder: string; name: string; post: string };
};

export function CommentForm({ lang, articleId, needsName, labels }: Props) {
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [state, action, pending] = useActionState(async (prev: Parameters<typeof postComment>[0], data: FormData) => {
    const result = await postComment(prev, data);
    // Empty the box once the comment is published; keep the text if it failed.
    if (result?.ok) setBody("");
    return result;
  }, null);

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="articleId" value={articleId} />
      {needsName && (
        <>
          <label className="block text-sm font-semibold" htmlFor="displayName">
            {labels.name}
          </label>
          <input
            id="displayName"
            name="displayName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={40}
            className="mt-1 mb-3 w-full border-2 border-ink px-3 py-2 sm:w-72"
          />
        </>
      )}
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        maxLength={2000}
        rows={4}
        placeholder={labels.placeholder}
        aria-label={labels.placeholder}
        className="w-full border-2 border-ink px-3 py-2"
      />
      <button disabled={pending} className="mt-2 bg-ink px-5 py-2 font-semibold text-paper disabled:opacity-50">
        {labels.post}
      </button>
      <FormMessage state={state} />
    </form>
  );
}
