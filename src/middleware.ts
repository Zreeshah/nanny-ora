import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;
  const role = (session?.user as any)?.role;
  const isLoggedIn = !!session?.user;

  // Admin routes — ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/admin", nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Nanny dashboard — NANNY only
  if (pathname.startsWith("/dashboard/nanny")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard/nanny", nextUrl));
    }
    if (role !== "NANNY") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Parent dashboard — PARENT only
  if (pathname.startsWith("/dashboard/parent")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard/parent", nextUrl));
    }
    if (role !== "PARENT") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
