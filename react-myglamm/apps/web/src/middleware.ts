import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.url.includes("%3F") || req.url.includes("%7B")) {
    const _url = new URL(req.url);
    return NextResponse.redirect(`${_url.origin}${decodeURIComponent(_url.pathname)}`, { status: 301 });
  }
  let originalUrl = req.nextUrl;
  let urlString = originalUrl.href;

  if (!urlString.includes("?")) {
    urlString = urlString.replace(/&/, "?");
  }

  if (urlString !== originalUrl.href) {
    // Rewrite the URL to the corrected one
    return NextResponse.redirect(urlString, { status: 301 });
  }

  // If everything is alright, continue with the request.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
