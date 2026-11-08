"use server";

import { redirect } from "next/navigation";
import { api } from "../lib/api";
import { getAccessToken } from "../lib/session";

type Item = { productId: string; variantId: string | null; quantity: number };

type QuoteResponse = {
  lines: {
    productId: string;
    variantId: string | null;
    slug: string;
    name: string;
    variantLabel: string | null;
    sku: string | null;
    image: string | null;
    unitPrice: number;
  }[];
  unavailable: { productId: string; variantId: string | null }[];
  subtotal: number;
  shippingFee: number;
};

// The API wants a missing variantId left out, not null.
const body = (items: Item[]) => items.map((i) => ({ productId: i.productId, quantity: i.quantity, ...(i.variantId && { variantId: i.variantId }) }));

/** Current names and prices for cart items; null when the shop can't be reached. */
export async function quoteCart(items: Item[]) {
  const res = await api<QuoteResponse>("/cart/quote", { body: { items: body(items) } });
  return res.ok ? res.data : null;
}

export type CheckoutState = {
  error?: string;
  /** Echoed back so a failed submit does not clear what the shopper typed. */
  values?: Record<string, string>;
};

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export async function placeOrderAction(_prev: CheckoutState, data: FormData): Promise<CheckoutState> {
  const values = Object.fromEntries(["name", "phone", "address", "note"].map((k) => [k, text(data, k)]));

  let items: Item[] = [];
  try {
    items = JSON.parse(text(data, "items")) as Item[];
  } catch {
    return { error: "Your cart could not be read. Please go back to the cart and try again.", values };
  }

  const res = await api<{ orderNumber: string; accessKey: string }>("/orders", {
    token: await getAccessToken(), // signed in: the order is linked to their account
    body: {
      items: body(items),
      name: values.name,
      phone: values.phone,
      address: values.address,
      note: values.note,
    },
  });
  if (!res.ok) return { error: res.message, values };

  // Only a cart checkout empties the cart; "Buy now" leaves it alone.
  const clear = text(data, "from") === "cart" ? "&clear=1" : "";
  redirect(`/order/${res.data.orderNumber}?key=${res.data.accessKey}${clear}`);
}
