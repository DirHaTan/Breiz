import { NextResponse, type NextRequest } from "next/server";

// Breton is the default language, so its pages have no prefix ("/keleier").
// Internally every page lives under a language folder, so we quietly
// rewrite "/keleier" to "/br/keleier". French pages already start with "/fr".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/fr" || pathname.startsWith("/fr/")) return;

  // Someone typed "/br/..." directly: send them to the address without "/br".
  if (pathname === "/br" || pathname.startsWith("/br/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/br${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals, API routes, and files such as icon.svg.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
