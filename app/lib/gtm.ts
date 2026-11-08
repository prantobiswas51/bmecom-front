// Google Tag Manager: the container id comes from NEXT_PUBLIC_GTM_ID and events go to window.dataLayer
// in the GA4 e-commerce shape, so tags in the container can forward them to GA4, Meta and the rest.
// Without an id nothing is loaded and every call here does nothing. Client-side only.

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

const id = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();

/** The container id, only when it looks like one (it ends up inside a script, so it is checked). */
export const GTM_ID = /^GTM-[A-Z0-9]+$/.test(id) ? id : "";

/** A product line in the GA4 `items` format. `item_id` is always the product id; the variant goes in `item_variant`. */
export type GtmItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  index?: number;
};

/** Sends a plain event, e.g. page_view or sign_up. */
export function track(event: string, params: DataLayerEntry = {}) {
  if (!GTM_ID || typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ event, ...params });
}

/** Sends an e-commerce event. The previous `ecommerce` object is cleared first, as GA4 expects. */
export function trackEcommerce(event: string, currency: string, items: GtmItem[], params: DataLayerEntry = {}) {
  if (!GTM_ID || typeof window === "undefined") return;
  const layer = (window.dataLayer ??= []);
  layer.push({ ecommerce: null });
  layer.push({ event, ecommerce: { currency, items, ...params } });
}

export const sumValue = (items: GtmItem[]) => items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
