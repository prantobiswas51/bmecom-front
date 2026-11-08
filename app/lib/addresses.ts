import type { Address } from "./address";
import { api } from "./api";
import { getAccessToken } from "./session";

/** The signed-in customer's saved addresses, default first. Empty when signed out or unreachable. Server only. */
export async function fetchAddresses(): Promise<Address[]> {
  const token = await getAccessToken();
  if (!token) return [];
  const res = await api<Address[]>("/addresses", { method: "GET", token });
  return res.ok ? res.data : [];
}
