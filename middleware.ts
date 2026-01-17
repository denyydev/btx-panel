import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWT_COOKIE_NAME = "auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(JWT_COOKIE_NAME)?.value;
  const hasValidToken = token && token.trim().length > 0;

  if (pathname.startsWith("/dashboard")) {
    if (!hasValidToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login") {
    if (hasValidToken) {
      return NextResponse.redirect(new URL("/dashboard/users", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
