"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, type ApiSession, type ApiUser } from "../lib/api";
import { getAccessToken, setSession } from "../lib/session";

export type ProfileState = { error?: string; success?: string; values?: Record<string, string> };

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export async function updateProfileAction(_prev: ProfileState, data: FormData): Promise<ProfileState> {
  const values = { name: text(data, "name") };
  const token = await getAccessToken();
  if (!token) redirect("/auth/login?next=/account/profile");

  const res = await api<ApiUser>("/auth/me", { method: "PATCH", token, body: values });
  if (!res.ok) return { error: res.message, values };

  revalidatePath("/account", "layout");
  return { success: "Your name is saved.", values };
}

export async function changePasswordAction(_prev: ProfileState, data: FormData): Promise<ProfileState> {
  const next = text(data, "newPassword");
  if (next !== text(data, "confirm")) return { error: "The two new passwords do not match." };
  const token = await getAccessToken();
  if (!token) redirect("/auth/login?next=/account/profile");

  const res = await api<ApiSession>("/auth/change-password", {
    token,
    body: { currentPassword: String(data.get("currentPassword") ?? ""), newPassword: next },
  });
  if (!res.ok) return { error: res.status === 401 ? "Your current password is not right." : res.message };

  await setSession(res.data); // every other device was signed out; keep this one signed in
  return { success: "Your password has been changed. Other devices were signed out." };
}
