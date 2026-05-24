// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // Store the original URL to redirect back after login
  if (isAdminPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", "/admin");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
