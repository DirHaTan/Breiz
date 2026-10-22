"use client";

import { useActionState } from "react";
import { deleteComment, reportComment, setCommentHidden } from "@/app/actions/comments";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
  commentId: number;
  hidden: boolean;
  canDelete: boolean;
  canReport: boolean;
  canHide: boolean;
  labels: { delete: string; confirmDelete: string; report: string; hide: string; unhide: string };
};

const button = "text-xs text-muted underline-offset-2 hover:underline disabled:opacity-50";

export function CommentActions({ lang, commentId, hidden, canDelete, canReport, canHide, labels }: Props) {
  const [reportState, report, reporting] = useActionState(reportComment, null);
  return (
    <div className="mt-1 flex flex-wrap gap-4">
      {canDelete && (
        <form action={deleteComment} onSubmit={(e) => !confirm(labels.confirmDelete) && e.preventDefault()}>
          <input type="hidden" name="commentId" value={commentId} />
          <button className={button}>{labels.delete}</button>
        </form>
      )}
      {canHide && (
        <form action={setCommentHidden}>
          <input type="hidden" name="commentId" value={commentId} />
          <input type="hidden" name="hidden" value={String(!hidden)} />
          <button className={button}>{hidden ? labels.unhide : labels.hide}</button>
        </form>
      )}
      {canReport &&
        (reportState?.message ? (
          <span className="text-xs text-muted">{reportState.message}</span>
        ) : (
          <form action={report}>
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="commentId" value={commentId} />
            <button disabled={reporting} className={button}>
              {labels.report}
            </button>
          </form>
        ))}
    </div>
  );
}
