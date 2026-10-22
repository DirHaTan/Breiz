import "server-only";
import { createClient } from "@/supabase/server";

// Creates the reader's profile the first time, or renames it afterwards.
export async function upsertDisplayName(userId: string, current: string | null, name: string) {
  const supabase = await createClient();
  const { error } =
    current === null
      ? await supabase.from("profiles").insert({ id: userId, display_name: name })
      : await supabase.from("profiles").update({ display_name: name }).eq("id", userId);
  if (error) console.error("Saving name failed:", error.message);
  return error;
}
