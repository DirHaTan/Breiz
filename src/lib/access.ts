import "server-only";
import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVE_STATUSES, getSubscriptionForUser } from "@/lib/subscriptions";
import { createClient } from "@/supabase/server";

// Can the current reader see the full text of paid articles?
// Yes for editors (the owner and writers) and for readers with an active
// subscription. Reads the sign-in cookie, so use it inside <Suspense>.
export const canReadPaidArticles = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  const supabase = await createClient();
  const [editor, subscription] = await Promise.all([
    supabase.from("editors").select("user_id").eq("user_id", user.id).maybeSingle(),
    getSubscriptionForUser(user.id),
  ]);
  return Boolean(editor.data) || Boolean(subscription && ACTIVE_STATUSES.includes(subscription.status));
});
