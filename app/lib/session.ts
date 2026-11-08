import { cookies } from "next/headers";
import { api, type ApiSession, type ApiUser } from "./api";

// Tokens live in httpOnly cookies, so page scripts can never read them.
export const ACCESS_COOKIE = "bm_at";
export const REFRESH_COOKIE = "bm_rt";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/** Stores a session from the backend. Only callable from a server action or route handler. */
export async function setSession(session: Pick<ApiSession, "accessToken" | "refreshToken" | "expiresIn">) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, session.accessToken, { ...cookieOptions, maxAge: session.expiresIn });
  jar.set(REFRESH_COOKIE, session.refreshToken, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

/** The signed-in user, or null. Wrap callers in <Suspense>: it reads cookies. */
export async function getCurrentUser(): Promise<ApiUser | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const res = await api<ApiUser>("/auth/me", { method: "GET", token });
  return res.ok ? res.data : null;
}
