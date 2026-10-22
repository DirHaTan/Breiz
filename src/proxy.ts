import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/supabase/session";

// Breton is the default language, so its pages have no prefix ("/keleier").
// Internally every page lives under a language folder, so we quietly
// rewrite "/keleier" to "/br/keleier". French pages already start with "/fr".
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Someone typed "/br/..." directly: send them to the address without "/br".
  if (pathname === "/br" || pathname.startsWith("/br/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    return refreshSession(request, () => NextResponse.next({ request }));
  }

  const url = request.nextUrl.clone();
  url.pathname = `/br${pathname === "/" ? "" : pathname}`;
  return refreshSession(request, () => NextResponse.rewrite(url, { request }));
}

export const config = {
  // Skip Next.js internals, API routes, sign-in links (/auth), the editor
  // (/studio), and files such as icon.svg.
  matcher: ["/((?!_next|api|auth|studio|.*\\..*).*)"],
};
