import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "nannyora-dev-secret-change-in-production";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const token = await getToken({
    req,
    secret: authSecret,
    secureCookie: nextUrl.protocol === "https:",
  });
  const role = token?.role;
  const isLoggedIn = !!token;

  // Admin routes — ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return redirectToLogin(req);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Nanny dashboard — NANNY only
  if (pathname.startsWith("/dashboard/nanny")) {
    if (!isLoggedIn) {
      return redirectToLogin(req);
    }
    if (role !== "NANNY") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Parent dashboard — PARENT only
  if (pathname.startsWith("/dashboard/parent")) {
    if (!isLoggedIn) {
      return redirectToLogin(req);
    }
    if (role !== "PARENT") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
