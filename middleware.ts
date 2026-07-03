import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();
const ACCESS_SECRET = encoder.encode(process.env.JWT_ACCESS_SECRET!);

const PUBLIC_PATHS = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get("access_token")?.value;

  let isAuthed = false;
  if (token) {
    try {
      await jwtVerify(token, ACCESS_SECRET);
      isAuthed = true;
    } catch {
      isAuthed = false;
    }
  }

  if (!isAuthed && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};