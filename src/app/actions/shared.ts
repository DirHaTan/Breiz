import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

// What a form shows after it's sent: a success or error message.
export type FormState = { ok: boolean; message: string; at: number } | null;

export function readLocale(formData: FormData): Locale {
  const lang = String(formData.get("lang") ?? "");
  return isLocale(lang) ? lang : defaultLocale;
}

export const success = (message: string): FormState => ({ ok: true, message, at: Date.now() });
export const failure = (message: string): FormState => ({ ok: false, message, at: Date.now() });
