"use server";

import { redirect } from "next/navigation";
import { api, type ApiSession } from "../lib/api";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSession,
} from "../lib/session";

export type FormState = {
  error?: string;
  success?: string;
  /** Echoed back so a failed submit does not clear what the user typed. */
  values?: { email?: string; name?: string };
};

const text = (data: FormData, key: string) => String(data.get(key) ?? "");

/** Only allow redirects to paths on this site. */
function safeNext(value: string, fallback = "/account") {
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export async function loginAction(_prev: FormState, data: FormData): Promise<FormState> {
  const email = text(data, "email").trim();
  const res = await api<ApiSession>("/auth/login", {
    body: { email, password: text(data, "password") },
  });
  if (!res.ok) return { error: res.message, values: { email } };

  await setSession(res.data);
  redirect(safeNext(text(data, "next")));
}

export async function signupAction(_prev: FormState, data: FormData): Promise<FormState> {
  const email = text(data, "email").trim();
  const name = text(data, "name").trim();
  const password = text(data, "password");
  const values = { email, name };

  if (password !== text(data, "confirm")) {
    return { error: "The two passwords do not match.", values };
  }
  const res = await api<ApiSession>("/auth/signup", {
    body: { email, password, ...(name && { name }) },
  });
  if (!res.ok) return { error: res.message, values };

  await setSession(res.data);
  redirect("/account?welcome=1");
}

export async function forgotPasswordAction(_prev: FormState, data: FormData): Promise<FormState> {
  const email = text(data, "email").trim();
  const res = await api("/auth/forgot-password", { body: { email } });
  // The backend answers the same whether or not the account exists; so do we.
  if (!res.ok && res.status !== 202) return { error: res.message, values: { email } };
  return { success: "If that email has an account, a reset link is on its way. It expires in 1 hour." };
}

export async function resetPasswordAction(_prev: FormState, data: FormData): Promise<FormState> {
  const password = text(data, "password");
  if (password !== text(data, "confirm")) return { error: "The two passwords do not match." };

  const res = await api("/auth/reset-password", { body: { token: text(data, "token"), password } });
  if (!res.ok) {
    return {
      error:
        res.status === 401
          ? "This reset link is invalid or has expired. Please request a new one."
          : res.message,
    };
  }
  redirect("/auth/login?reset=1");
}

export async function verifyEmailAction(_prev: FormState, data: FormData): Promise<FormState> {
  const res = await api("/auth/verify-email", { body: { token: text(data, "token") } });
  if (!res.ok) {
    return {
      error:
        res.status === 401
          ? "This verification link is invalid or has expired. Sign in and request a new one."
          : res.message,
    };
  }
  return { success: "Your email is verified. Thank you!" };
}

export async function resendVerificationAction(): Promise<FormState> {
  const token = await getAccessToken();
  if (!token) redirect("/auth/login?next=/account");
  const res = await api("/auth/resend-verification", { token });
  if (!res.ok) return { error: res.message };
  return { success: "Verification email sent. Check your inbox." };
}

export async function logoutAction() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) await api("/auth/logout", { body: { refreshToken } });
  await clearSession();
  redirect("/");
}
