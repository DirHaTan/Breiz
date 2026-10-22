import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { accountPath, safeNextPath } from "@/i18n/config";
import { createClient } from "@/supabase/server";

// Step 2 of signing in: the reader clicked the link in their email.
// We check it with Supabase, which signs them in, then send them back
// to the page they were on.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");

  const cookieStore = await cookies();
  const lang = cookieStore.get("breiz_lang")?.value === "fr" ? "fr" : "br";
  const next = safeNextPath(cookieStore.get("breiz_next")?.value) ?? accountPath(lang);
  cookieStore.delete("breiz_next");

  const supabase = await createClient();
  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  redirect(ok ? next : `${accountPath(lang)}?error=link`);
}
