import { Suspense } from "react";
import Link from "next/link";
import { accountPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { getComments } from "@/lib/comments";
import { isSupabaseConfigured } from "@/supabase/env";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentItem } from "@/components/comments/CommentItem";

type Props = { lang: Locale; dict: Dictionary; articleId: string; articleHref: string };

// The comments under an article. Any signed-in reader can comment.
export function Comments(props: Props) {
  const { dict } = props;
  return (
    <section className="mt-12 border-t-4 border-double border-ink pt-6">
      <h2 className="font-serif text-2xl font-bold">{dict.comments.title}</h2>
      {isSupabaseConfigured ? (
        // Comments depend on who is reading, so they load just after the article.
        <Suspense fallback={<p className="mt-3 text-muted">…</p>}>
          <CommentThread {...props} />
        </Suspense>
      ) : (
        <p className="mt-3 text-muted">{dict.comments.comingSoon}</p>
      )}
    </section>
  );
}

async function CommentThread({ lang, dict, articleId, articleHref }: Props) {
  const t = dict.comments;
  const [user, comments] = await Promise.all([getCurrentUser(), getComments(articleId)]);
  return (
    <>
      {comments.length === 0 ? (
        <p className="mt-3 text-muted">{t.none}</p>
      ) : (
        <ul className="mt-4">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} user={user} lang={lang} dict={dict} />
          ))}
        </ul>
      )}
      {user ? (
        <CommentForm
          lang={lang}
          articleId={articleId}
          needsName={user.displayName === null}
          labels={{ placeholder: t.placeholder, name: t.nameLabel, post: t.post }}
        />
      ) : (
        <p className="mt-6 border-2 border-ink p-4">
          {t.signInToComment}{" "}
          <Link href={`${accountPath(lang)}?next=${encodeURIComponent(articleHref)}`} className="font-semibold underline">
            {t.signInLink}
          </Link>
        </p>
      )}
    </>
  );
}
