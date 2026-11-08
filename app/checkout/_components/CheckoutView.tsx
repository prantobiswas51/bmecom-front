"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState } from "react";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { LineThumb } from "../../cart/_components/LineThumb";
import { placeOrderAction, type CheckoutState } from "../../cart/actions";
import { Price } from "../../components/Price";
import { toDefaults, type Address } from "../../lib/address";
import { TrackEcommerce } from "../../components/Track";
import { lineKey, useCart, useQuote, type CartItem } from "../../lib/cart";

const initial: CheckoutState = {};
const panel = "rounded-[var(--radius-card)] border border-line bg-white";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** "Buy now" links carry their one item in the URL; otherwise checkout is for the cart. */
function useBuyNowItem(): CartItem | null {
  const params = useSearchParams();
  const productId = params.get("product");
  const variantId = params.get("variant");
  const quantity = Number(params.get("qty") ?? 1);
  return useMemo(
    () =>
      productId && UUID.test(productId) && (!variantId || UUID.test(variantId))
        ? { productId, variantId: variantId || null, quantity: Number.isInteger(quantity) && quantity > 0 ? Math.min(99, quantity) : 1 }
        : null,
    [productId, variantId, quantity],
  );
}

export function CheckoutView({ addresses = [], accountName }: { addresses?: Address[]; accountName?: string | null }) {
  const cart = useCart();
  const buyNow = useBuyNowItem();
  const items = useMemo(() => (buyNow ? [buyNow] : cart), [buyNow, cart]);
  const quote = useQuote(items);
  // Saved addresses: the default is picked to start with; choosing another refills the delivery fields.
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const defaults = toDefaults(addresses.find((a) => a.id === addressId), accountName);

  const [state, action, pending] = useActionState(placeOrderAction, initial);

  if (items.length === 0) {
    return (
      <div className={`${panel} p-10 text-center`}>
        <p className="text-lg font-semibold text-brand">There is nothing to check out</p>
        <p className="mt-1 text-sm text-muted">Your cart is empty.</p>
        <Button href="/shop" className="mt-6">
          Continue shopping
        </Button>
      </div>
    );
  }
  if (quote.status === "loading") return <div className={`${panel} h-96 animate-pulse`} aria-busy="true" aria-label="Loading checkout" />;
  if (quote.status === "error") {
    return <p className={`${panel} p-8 text-center text-muted`}>Checkout could not be loaded right now. Please try again in a moment.</p>;
  }

  const lines = items.flatMap((item) => {
    const line = quote.lines.get(lineKey(item));
    return line ? [{ item, line }] : [];
  });
  if (lines.length === 0) {
    return (
      <div className={`${panel} p-10 text-center`}>
        <p className="text-lg font-semibold text-brand">These items are no longer available</p>
        <Button href="/shop" className="mt-6">
          Continue shopping
        </Button>
      </div>
    );
  }

  const subtotal = lines.reduce((sum, l) => sum + l.line.unitPrice * l.item.quantity, 0);
  const shipping = quote.shippingFee;
  const v: Record<string, string | undefined> = state.values ?? defaults ?? {};

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <TrackEcommerce
        event="begin_checkout"
        items={lines.map((l) => ({
          item_id: l.item.productId,
          item_name: l.line.name,
          price: l.line.unitPrice,
          quantity: l.item.quantity,
          ...(l.line.variantLabel && { item_variant: l.line.variantLabel }),
        }))}
      />
      <input type="hidden" name="items" value={JSON.stringify(lines.map((l) => l.item))} />
      <input type="hidden" name="from" value={buyNow ? "buy-now" : "cart"} />

      <div className="space-y-6">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {lines.length < items.length && (
          <Alert tone="info">Some items in your cart are no longer available and were left out of this order.</Alert>
        )}

        <section className={`${panel} space-y-5 p-5 sm:p-6`}>
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Delivery details</h2>
          {addresses.length > 1 && (
            <div>
              <label htmlFor="saved-address" className="mb-1.5 block text-sm font-semibold text-brand">
                Deliver to
              </label>
              <select
                id="saved-address"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                className="w-full rounded-[var(--radius-btn)] border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
              >
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {`${a.label ? `${a.label}: ` : ""}${a.fullName}, ${a.address}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div key={addressId} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" name="name" autoComplete="name" required maxLength={100} defaultValue={v.name} />
            <Field
              label="Mobile *"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="01712345678"
              defaultValue={v.phone}
            />
          </div>
          <Field
            label="Address *"
            name="address"
            autoComplete="street-address"
            required
            maxLength={500}
            placeholder="House, road, area"
            defaultValue={v.address}
          />
          </div>
          <Field label="Order note (optional)" name="note" maxLength={500} placeholder="Anything we should know?" defaultValue={v.note} />
        </section>

        <section className={`${panel} p-5 sm:p-6`}>
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Payment</h2>
          <p className="mt-3 flex items-center gap-2 rounded-[var(--radius-btn)] border border-brand bg-soft px-4 py-3 text-sm font-semibold text-brand">
            <input type="radio" checked readOnly aria-label="Cash on delivery" />
            Cash on delivery
          </p>
          <p className="mt-2 text-xs text-muted">Pay in cash when your order arrives.</p>
        </section>
      </div>

      <aside className={`${panel} h-fit p-5 sm:p-6 lg:sticky lg:top-40`}>
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Your order</h2>
        <ul className="mt-4 divide-y divide-line">
          {lines.map(({ item, line }) => (
            <li key={lineKey(item)} className="flex gap-3 py-3 first:pt-0">
              <LineThumb image={line.image} size="h-14 w-14" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold text-brand">{line.name}</p>
                {line.variantLabel && <p className="text-muted">{line.variantLabel}</p>}
                <p className="text-muted">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold"><Price value={line.unitPrice * item.quantity} /></p>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold"><Price value={subtotal} /></dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="font-semibold"><Price value={shipping} /></dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-extrabold text-brand">
          <span>Total</span>
          <span><Price value={subtotal + shipping} /></span>
        </div>
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={pending}>
          {pending ? "Placing order..." : "Place order"}
        </Button>
        {!buyNow && (
          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-accent-dark hover:underline">
            ← Back to cart
          </Link>
        )}
      </aside>
    </form>
  );
}
