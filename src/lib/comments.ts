import "server-only";
import { createClient } from "@/supabase/server";

export type Comment = {
  id: number;
  articleId: string;
  userId: string;
  author: string;
  body: string;
  hidden: boolean;
  createdAt: string;
};

type Row = {
  id: number;
  article_id: string;
  user_id: string;
  body: string;
  hidden: boolean;
  created_at: string;
  profiles: { display_name: string } | null;
};

const columns = "id, article_id, user_id, body, hidden, created_at, profiles(display_name)";

function toComment(row: Row): Comment {
  return {
    id: row.id,
    articleId: row.article_id,
    userId: row.user_id,
    author: row.profiles?.display_name ?? "?",
    body: row.body,
    hidden: row.hidden,
    createdAt: row.created_at,
  };
}

// Comments under an article, oldest first. Hidden ones are only returned
// to moderators (the database decides).
export async function getComments(articleId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(columns)
    .eq("article_id", articleId)
    .order("created_at", { ascending: true });
  if (error) console.error("Loading comments failed:", error.message);
  return ((data ?? []) as unknown as Row[]).map(toComment);
}

// For the moderation page: reported comments (with how many reports) and hidden ones.
export async function getModerationQueue() {
  const supabase = await createClient();
  const [reports, hidden] = await Promise.all([
    supabase.from("comment_reports").select(`comment_id, comments(${columns})`),
    supabase.from("comments").select(columns).eq("hidden", true).order("created_at", { ascending: false }),
  ]);

  const reported = new Map<number, { comment: Comment; reports: number }>();
  for (const report of (reports.data ?? []) as unknown as { comments: Row | null }[]) {
    if (!report.comments || report.comments.hidden) continue;
    const entry = reported.get(report.comments.id) ?? { comment: toComment(report.comments), reports: 0 };
    entry.reports += 1;
    reported.set(report.comments.id, entry);
  }
  return {
    reported: [...reported.values()].toSorted((a, b) => b.reports - a.reports),
    hidden: ((hidden.data ?? []) as unknown as Row[]).map(toComment),
  };
}
