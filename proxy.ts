import { NextResponse, type NextRequest } from "next/server";

// Keeps signed-in users signed in: when the short-lived access cookie has expired
// but the refresh cookie is still there, trade it for a new pair before the page renders.
// Only runs for account pages, and never for prefetches, because the backend treats
// a refresh token that is used twice as stolen and ends every session.

const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3034"
).replace(/\/$/, "");

const ACCESS_COOKIE = "bm_at";
const REFRESH_COOKIE = "bm_rt";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const isPrefetch =
    request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch";

  if (request.cookies.has(ACCESS_COOKIE) || !refreshToken || isPrefetch) {
    return NextResponse.next();
  }

  let session: { accessToken: string; refreshToken: string; expiresIn: number } | null = null;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (res.ok) session = await res.json();
  } catch {
    return NextResponse.next();
  }

  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  if (!session) {
    // The refresh token is dead; drop both cookies so the page treats the visitor as signed out.
    request.cookies.delete(ACCESS_COOKIE);
    request.cookies.delete(REFRESH_COOKIE);
    const response = NextResponse.next({ request: { headers: request.headers } });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  // Make the new tokens visible to this very render, and store them in the browser.
  request.cookies.set(ACCESS_COOKIE, session.accessToken);
  request.cookies.set(REFRESH_COOKIE, session.refreshToken);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(ACCESS_COOKIE, session.accessToken, { ...options, maxAge: session.expiresIn });
  response.cookies.set(REFRESH_COOKIE, session.refreshToken, { ...options, maxAge: REFRESH_MAX_AGE });
  return response;
}

export const config = {
  matcher: ["/account/:path*"],
};
