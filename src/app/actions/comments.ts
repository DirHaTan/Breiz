"use server";

import { refresh } from "next/cache";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { getAllArticles } from "@/lib/articles";
import { createClient } from "@/supabase/server";
import { upsertDisplayName } from "@/lib/profiles";
import { failure, readLocale, success, type FormState } from "./shared";

export async function postComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = readLocale(formData);
  const dict = getDictionary(lang);
  const t = dict.comments;
  const user = await getCurrentUser();
  if (!user) return failure(t.error);

  const articleId = String(formData.get("articleId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return failure(t.empty);
  if (body.length > 2000) return failure(t.tooLong);
  if (!(await getAllArticles()).some((a) => a.id === articleId)) return failure(t.error);

  // First comment: the reader also chooses the name shown with it.
  if (user.displayName === null) {
    const name = String(formData.get("displayName") ?? "").trim();
    if (name.length < 2 || name.length > 40) return failure(dict.account.nameInvalid);
    if (await upsertDisplayName(user.id, null, name)) return failure(t.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({ article_id: articleId, user_id: user.id, body });
  if (error) {
    console.error("Posting comment failed:", error.message);
    return failure(error.message.includes("too_many_comments") ? t.tooMany : t.error);
  }
  refresh();
  return success("");
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient();
  // The database only lets the author or a moderator delete.
  await supabase.from("comments").delete().eq("id", Number(formData.get("commentId")));
  refresh();
}

export async function setCommentHidden(formData: FormData) {
  const supabase = await createClient();
  // The database only lets moderators do this.
  await supabase
    .from("comments")
    .update({ hidden: formData.get("hidden") === "true" })
    .eq("id", Number(formData.get("commentId")));
  refresh();
}

export async function reportComment(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = getDictionary(readLocale(formData)).comments;
  const user = await getCurrentUser();
  if (!user) return failure(t.error);
  const supabase = await createClient();
  const { error } = await supabase
    .from("comment_reports")
    .insert({ comment_id: Number(formData.get("commentId")), user_id: user.id });
  // "23505" means this reader already reported it: that's fine.
  if (error && error.code !== "23505") return failure(t.error);
  return success(t.reported);
}
