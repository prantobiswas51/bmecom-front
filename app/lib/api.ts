// Server-side client for the NestJS backend. Import this from server code only
// (server actions, route handlers, server components, proxy).

export const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3034"
).replace(/\/$/, "");

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; message: string };

export type ApiUser = {
  id: string;
  email: string;
  name: string | null;
  role: "customer" | "admin" | "superadmin" | "designer" | "dealer";
  emailVerified: boolean;
};

export type ApiSession = {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
};

/** Turns a NestJS error body into one readable message. */
function errorMessage(status: number, body: unknown): string {
  if (status === 429) return "Too many attempts. Please wait a minute and try again.";
  const message = (body as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.map(capitalize).join(". ");
  if (typeof message === "string") return message;
  return "Something went wrong. Please try again.";
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function api<T = null>(
  path: string,
  options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; token?: string } = {},
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "POST",
      headers: {
        ...(options.body !== undefined && { "Content-Type": "application/json" }),
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    const body = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) return { ok: false, status: res.status, message: errorMessage(res.status, body) };
    return { ok: true, status: res.status, data: body as T };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "We could not reach the server. Please try again in a moment.",
    };
  }
}
