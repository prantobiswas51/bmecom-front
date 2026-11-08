"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { quoteCart } from "../cart/actions";

// The cart is just ids and quantities in the browser. Names and prices are looked up from the
// API whenever it is shown, so a stale cart can never carry an old price into an order.

export type CartItem = { productId: string; variantId: string | null; quantity: number };

const KEY = "bm_cart";
const MAX_QTY = 99;
const EMPTY: CartItem[] = [];

export const lineKey = (i: { productId: string; variantId: string | null }) => `${i.productId}:${i.variantId ?? ""}`;

let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };
const listeners = new Set<() => void>();

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache.items; // storage blocked: keep whatever this tab has
  }
  if (raw === cache.raw) return cache.items; // same string, same array: useSyncExternalStore needs that
  let items = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (i): i is CartItem =>
          !!i && typeof i.productId === "string" && Number.isInteger(i.quantity) && i.quantity > 0 &&
          (i.variantId === null || typeof i.variantId === "string"),
      );
    }
  } catch {
    // a corrupt cart is an empty cart
  }
  cache = { raw, items };
  return items;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // storage blocked or full: the cart still works for this tab, it just won't survive a reload
  }
  cache = { raw, items };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener(); // another tab changed it
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function addToCart(item: CartItem) {
  const items = read();
  const key = lineKey(item);
  const found = items.find((i) => lineKey(i) === key);
  write(
    found
      ? items.map((i) => (i === found ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + item.quantity) } : i))
      : [...items, { ...item, quantity: Math.min(MAX_QTY, item.quantity) }],
  );
}

export function setQuantity(key: string, quantity: number) {
  const q = Math.max(1, Math.min(MAX_QTY, Math.round(quantity)));
  write(read().map((i) => (lineKey(i) === key ? { ...i, quantity: q } : i)));
}

export const removeFromCart = (key: string) => write(read().filter((i) => lineKey(i) !== key));
export const clearCart = () => write(EMPTY);

/** The cart's items. Empty on the server and during hydration, then the saved cart. */
export function useCart() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export type QuotedLine = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantLabel: string | null;
  sku: string | null;
  image: string | null;
  unitPrice: number;
};

export type Quote =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; lines: Map<string, QuotedLine>; shippingFee: number };

/**
 * Looks up current names and prices for `items`. Only which products are in the list matters,
 * not their quantities, so changing a quantity never refetches.
 */
export function useQuote(items: CartItem[]): Quote {
  const signature = JSON.stringify(items.map((i) => [i.productId, i.variantId]));
  const [result, setResult] = useState<{ signature: string; quote: Quote }>({ signature: "", quote: { status: "loading" } });

  useEffect(() => {
    if (signature === "[]") return;
    let stale = false;
    const pairs = JSON.parse(signature) as [string, string | null][];
    void quoteCart(pairs.map(([productId, variantId]) => ({ productId, variantId, quantity: 1 }))).then((res) => {
      if (stale) return;
      const quote: Quote = res
        ? { status: "ready", lines: new Map(res.lines.map((l) => [lineKey(l), l])), shippingFee: res.shippingFee }
        : { status: "error" };
      setResult({ signature, quote });
    });
    return () => {
      stale = true;
    };
  }, [signature]);

  if (signature === "[]") return { status: "ready", lines: new Map(), shippingFee: 0 };
  // A result for an older set of items is not an answer for this one.
  return result.signature === signature ? result.quote : { status: "loading" };
}
