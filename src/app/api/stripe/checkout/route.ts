import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { checkoutDestination, readPlan } from "@/lib/checkout";

// Reached after signing in with a plan already chosen: goes straight to
// Stripe's payment page, so the reader doesn't click "Koumananti" twice.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lang = params.get("lang") ?? "";
  redirect(await checkoutDestination(isLocale(lang) ? lang : defaultLocale, readPlan(params.get("plan"))));
}
