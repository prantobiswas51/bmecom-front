"use client";

import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Price } from "../../components/Price";
import { TrackEcommerce } from "../../components/Track";
import { useCurrencyCode } from "../../components/Price";
import { lineKey, removeFromCart, setQuantity, useCart, useQuote } from "../../lib/cart";
import { trackEcommerce, type GtmItem } from "../../lib/gtm";
import { LineThumb } from "./LineThumb";
import { QtyStepper } from "./QtyStepper";

const panel = "rounded-[var(--radius-card)] border border-line bg-white";

export function CartView() {
  const items = useCart();
  const quote = useQuote(items);
  const currency = useCurrencyCode();

  if (items.length === 0) {
    return (
      <div className={`${panel} p-10 text-center`}>
        <p className="text-lg font-semibold text-brand">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted">Find something you like and add it here.</p>
        <Button href="/shop" className="mt-6">
          Continue shopping
        </Button>
      </div>
    );
  }

  if (quote.status === "loading") return <div className={`${panel} h-64 animate-pulse`} aria-busy="true" aria-label="Loading your cart" />;
  if (quote.status === "error") {
    return (
      <p className={`${panel} p-8 text-center text-muted`}>
        Your cart could not be loaded right now. Please try again in a moment.
      </p>
    );
  }

  const rows = items.map((item) => ({ item, key: lineKey(item), line: quote.lines.get(lineKey(item)) }));
  const available = rows.filter((r) => r.line);
  const gone = rows.filter((r) => !r.line);
  const subtotal = available.reduce((sum, r) => sum + r.line!.unitPrice * r.item.quantity, 0);

  const toItem = (r: (typeof available)[number]): GtmItem => ({
    item_id: r.item.productId,
    item_name: r.line!.name,
    price: r.line!.unitPrice,
    quantity: r.item.quantity,
    ...(r.line!.variantLabel && { item_variant: r.line!.variantLabel }),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <TrackEcommerce event="view_cart" items={available.map(toItem)} />
      <div className="space-y-4">
        {gone.length > 0 && (
          <div role="alert" className="rounded-[var(--radius-btn)] border border-danger/20 bg-red-50 px-4 py-3 text-sm text-danger">
            <p className="font-semibold">
              {gone.length === 1 ? "One item is" : `${gone.length} items are`} no longer available.
            </p>
            <button type="button" onClick={() => gone.forEach((r) => removeFromCart(r.key))} className="mt-1 font-semibold underline">
              Remove {gone.length === 1 ? "it" : "them"} from the cart
            </button>
          </div>
        )}

        <ul className={`${panel} divide-y divide-line`}>
          {available.map(({ item, key, line }) => (
            <li key={key} className="flex gap-4 p-4 sm:p-5">
              <Link href={`/product/${line!.slug}`}>
                <LineThumb image={line!.image} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/product/${line!.slug}`} className="block font-semibold text-brand hover:underline">
                    {line!.name}
                  </Link>
                  {line!.variantLabel && <p className="text-sm text-muted">{line!.variantLabel}</p>}
                  <p className="mt-1 text-sm text-muted"><Price value={line!.unitPrice} /> each</p>
                </div>
                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <QtyStepper value={item.quantity} onChange={(q) => setQuantity(key, q)} label={`Quantity for ${line!.name}`} />
                  <p className="w-24 text-right font-bold text-brand"><Price value={line!.unitPrice * item.quantity} /></p>
                  <button
                    type="button"
                    onClick={() => {
                      trackEcommerce("remove_from_cart", currency, [toItem({ item, key, line })], { value: line!.unitPrice * item.quantity });
                      removeFromCart(key);
                    }}
                    aria-label={`Remove ${line!.name}`}
                    className="text-sm font-semibold text-muted hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/shop" className="inline-block text-sm font-semibold text-accent-dark hover:underline">
          ← Continue shopping
        </Link>
      </div>

      <aside className={`${panel} h-fit p-5 sm:p-6 lg:sticky lg:top-40`}>
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-semibold"><Price value={subtotal} /></dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-muted">Calculated at checkout</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-extrabold text-brand">
          <span>Total</span>
          <span><Price value={subtotal} /></span>
        </div>
        <p className="mt-1 text-xs text-muted">Delivery is a flat <Price value={quote.shippingFee} /> on every order.</p>
        <Button href="/checkout" size="lg" className="mt-5 w-full">
          Proceed to checkout
        </Button>
      </aside>
    </div>
  );
}
