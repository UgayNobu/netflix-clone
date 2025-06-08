import { NextResponse } from "next/server";

export function middleware(request) {
  // Example: protect /my-list route
  if (request.nextUrl.pathname.startsWith("/my-list")) {
    // Replace with real auth logic
    const isAuthenticated = false;
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
