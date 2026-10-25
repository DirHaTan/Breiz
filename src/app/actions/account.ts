"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { accountPath, localePath, safeNextPath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/supabase/server";
import { SITE_URL } from "@/lib/site";
import { upsertDisplayName } from "@/lib/profiles";
import { failure, readLocale, success, type FormState } from "./shared";

const shortCookie = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60, secure: process.env.NODE_ENV === "production" };

// Step 1 of signing in: email the reader a link. Clicking it opens /auth/confirm.
export async function sendSignInLink(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = readLocale(formData);
  const t = getDictionary(lang).account;
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return failure(t.invalidEmail);

  // Remember where to go back to after clicking the link (and in which language).
  const cookieStore = await cookies();
  cookieStore.set("breiz_next", safeNextPath(formData.get("next")) ?? accountPath(lang), shortCookie);
  cookieStore.set("breiz_lang", lang, shortCookie);

  const origin = process.env.NEXT_PUBLIC_SITE_URL ? SITE_URL : ((await headers()).get("origin") ?? SITE_URL);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) {
    console.error("Sign-in email failed:", error.message);
    return failure(error.status === 429 ? t.tooManyEmails : t.genericError);
  }
  return success(t.linkSent);
}

export async function saveDisplayName(_prev: FormState, formData: FormData): Promise<FormState> {
  const lang = readLocale(formData);
  const t = getDictionary(lang).account;
  const user = await getCurrentUser();
  if (!user) return failure(t.genericError);

  const name = String(formData.get("displayName") ?? "").trim();
  if (name.length < 2 || name.length > 40) return failure(t.nameInvalid);

  const error = await upsertDisplayName(user.id, user.displayName, name);
  if (error) return failure(t.genericError);
  refresh();
  return success(t.saved);
}

export async function signOut(formData: FormData) {
  const lang = readLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(localePath(lang));
}
