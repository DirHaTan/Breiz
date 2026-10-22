import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CurrentUser } from "@/lib/auth";
import type { Comment } from "@/lib/comments";
import { FormattedDate } from "@/components/FormattedDate";
import { CommentActions } from "./CommentActions";

type Props = { comment: Comment; user: CurrentUser | null; lang: Locale; dict: Dictionary };

export function CommentItem({ comment, user, lang, dict }: Props) {
  const t = dict.comments;
  const own = user?.id === comment.userId;
  return (
    <li className={`border-t border-ink py-4 ${comment.hidden ? "opacity-60" : ""}`}>
      <p className="text-sm">
        <strong>{comment.author}</strong> · <FormattedDate date={comment.createdAt} lang={lang} />
        {comment.hidden && <span className="ml-2 bg-ink px-1.5 text-xs text-paper">{t.hiddenLabel}</span>}
      </p>
      <p className="mt-1 whitespace-pre-line break-words">{comment.body}</p>
      {user && (
        <CommentActions
          lang={lang}
          commentId={comment.id}
          hidden={comment.hidden}
          canDelete={own || user.isModerator}
          canReport={!own}
          canHide={user.isModerator}
          labels={{ delete: t.delete, confirmDelete: t.confirmDelete, report: t.report, hide: t.hide, unhide: t.unhide }}
        />
      )}
    </li>
  );
}
