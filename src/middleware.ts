// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { NextMiddleware } from "next/server";

// This is the function that runs on each request
export function middleware(req: NextRequest) {
  // Check if the request has a cookie with userType
  const userType = req.cookies.get("userType");

  // Check for a protected page
  const url = req.nextUrl.pathname;

  // Redirect to login page if not authenticated
  if (!userType && !url.includes("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow requests to continue if the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/admin"], // Add other protected routes here
};
