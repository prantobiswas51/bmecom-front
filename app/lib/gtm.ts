// Google Tag Manager: the container id is read on the server at request time from GTM_ID (the server's
// own .env, so it is not baked into the build and never needs to be in GitHub). The server puts it on
// window.__GTM_ID. Events go to window.dataLayer in the GA4 e-commerce shape, so tags in the container
// can forward them to GA4, Meta and the rest. Without an id nothing is loaded and every call here does nothing.

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    /** Set by the server: the container id, or "" when tracking is off. Undefined until the page has loaded it. */
    __GTM_ID?: string;
  }
}

/** The container id, only when it looks like one (it ends up inside a script, so it is checked). */
export function parseGtmId(value: string | undefined): string {
  const id = (value ?? "").trim();
  return /^GTM-[A-Z0-9]+$/.test(id) ? id : "";
}

/** Tracking is known to be off: the server said there is no container id. Until it says anything, events are kept. */
const off = () => typeof window === "undefined" || window.__GTM_ID === "";

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
  if (off()) return;
  (window.dataLayer ??= []).push({ event, ...params });
}

/** Sends an e-commerce event. The previous `ecommerce` object is cleared first, as GA4 expects. */
export function trackEcommerce(event: string, currency: string, items: GtmItem[], params: DataLayerEntry = {}) {
  if (off()) return;
  const layer = (window.dataLayer ??= []);
  layer.push({ ecommerce: null });
  layer.push({ event, ecommerce: { currency, items, ...params } });
}

export const sumValue = (items: GtmItem[]) => items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);
