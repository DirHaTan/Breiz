import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./env";

// Keeps a signed-in reader signed in: if their session is about to expire,
// Supabase renews it here and we send the new cookie back to the browser.
// `makeResponse` builds the normal response (e.g. the Breton rewrite).
export async function refreshSession(request: NextRequest, makeResponse: () => NextResponse) {
  let response = makeResponse();
  const hasSession = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!isSupabaseConfigured || !hasSession) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = makeResponse();
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}
