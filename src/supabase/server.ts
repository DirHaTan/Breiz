import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

// A Supabase connection acting as the current reader (from their sign-in cookie).
// The database rules in supabase/schema.sql decide what each reader may do.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called while rendering a page, where cookies can't be changed.
          // The proxy refreshes the session on the next request instead.
        }
      },
    },
  });
}
