"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "../../lib/api";
import { getAccessToken } from "../../lib/session";

export type AddressState = { error?: string; done?: boolean; values?: Record<string, string> };

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

async function token() {
  const t = await getAccessToken();
  if (!t) redirect("/auth/login?next=/account/addresses");
  return t;
}

/** Creates an address, or updates one when `id` is given. */
export async function saveAddressAction(id: string | null, _prev: AddressState, data: FormData): Promise<AddressState> {
  const values = { label: text(data, "label"), fullName: text(data, "fullName"), phone: text(data, "phone"), address: text(data, "address") };
  const body = { ...values, label: values.label || null, ...(data.get("isDefault") && { isDefault: true }) };

  const res = await api(id ? `/addresses/${id}` : "/addresses", { method: id ? "PATCH" : "POST", token: await token(), body });
  if (!res.ok) return { error: res.message, values };

  revalidatePath("/account", "layout");
  return { done: true };
}

export async function makeDefaultAction(id: string) {
  await api(`/addresses/${id}`, { method: "PATCH", token: await token(), body: { isDefault: true } });
  revalidatePath("/account", "layout");
}

export async function deleteAddressAction(id: string) {
  await api(`/addresses/${id}`, { method: "DELETE", token: await token() });
  revalidatePath("/account", "layout");
}
