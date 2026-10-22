import "server-only";
import { cache } from "react";
import { createClient } from "@/supabase/server";
import { isSupabaseConfigured } from "@/supabase/env";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string | null;
  isModerator: boolean;
};

// The signed-in reader, or null. Reads the sign-in cookie, so any component
// calling this must be inside a <Suspense> boundary. Runs once per request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const [profile, moderator] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", claims.sub).maybeSingle(),
    supabase.from("moderators").select("user_id").eq("user_id", claims.sub).maybeSingle(),
  ]);
  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    displayName: profile.data?.display_name ?? null,
    isModerator: Boolean(moderator.data),
  };
});
