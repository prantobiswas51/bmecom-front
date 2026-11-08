"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { LineThumb } from "../../../cart/_components/LineThumb";
import { placeOrderAction, type CheckoutState } from "../../../cart/actions";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { Price } from "../../../components/Price";
import type { Defaults } from "../../../lib/address";
import { lineKey, useQuote, type CartItem } from "../../../lib/cart";

const initial: CheckoutState = {};

/** Quick order for one item: just name, mobile and address, right on the product page. */
export function BuyNowModal({ item, variantLabel, defaults, onClose }: { item: CartItem; variantLabel?: string | null; defaults?: Defaults; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const items = useMemo(() => [item], [item]);
  const quote = useQuote(items);
  const [state, action, pending] = useActionState(placeOrderAction, initial);
  const v = state.values ?? defaults ?? {};

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
  }, []);

  const line = quote.status === "ready" ? quote.lines.get(lineKey(item)) : undefined;
  const subtotal = line ? line.unitPrice * item.quantity : 0;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()} // a click on the backdrop closes it
      aria-labelledby="buy-now-title"
      className="m-auto w-[min(92vw,460px)] rounded-[var(--radius-card)] border border-line bg-white p-0 text-ink shadow-xl backdrop:bg-black/50"
    >
      <form action={action} className="space-y-5 p-5 sm:p-6">
        <input type="hidden" name="items" value={JSON.stringify([item])} />
        <input type="hidden" name="from" value="buy-now" />

        <div className="flex items-start justify-between gap-4">
          <h2 id="buy-now-title" className="text-lg font-bold text-brand">
            Quick order
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="-m-1 p-1 text-2xl leading-none text-muted hover:text-brand">
            ×
          </button>
        </div>

        {quote.status === "ready" && line && (
          <div className="flex items-center gap-3 rounded-[var(--radius-btn)] bg-soft p-3">
            <LineThumb image={line.image} size="h-12 w-12" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-semibold text-brand">{line.name}</p>
              <p className="text-muted">
                {variantLabel ? `${variantLabel} · ` : ""}Qty {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-brand"><Price value={subtotal} /></p>
          </div>
        )}
        {quote.status === "error" && <Alert tone="error">Could not load this item right now. Please try again.</Alert>}
        {quote.status === "ready" && !line && <Alert tone="error">This item is no longer available.</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}

        <Field label="Full name *" name="name" autoComplete="name" required maxLength={100} defaultValue={v.name} />
        <Field label="Mobile *" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="01712345678" defaultValue={v.phone} />
        <Field label="Address *" name="address" autoComplete="street-address" required maxLength={500} placeholder="House, road, area" defaultValue={v.address} />

        {quote.status === "ready" && line && (
          <dl className="space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="font-semibold"><Price value={quote.shippingFee} /></dd>
            </div>
            <div className="flex justify-between text-base font-extrabold text-brand">
              <dt>Total (cash on delivery)</dt>
              <dd><Price value={subtotal + quote.shippingFee} /></dd>
            </div>
          </dl>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={pending || !line}>
          {pending ? "Placing order..." : "Place order"}
        </Button>
      </form>
    </dialog>
  );
}
