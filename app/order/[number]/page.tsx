import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LineThumb } from "../../cart/_components/LineThumb";
import { Button } from "../../components/ui/Button";
import { Price } from "../../components/Price";
import { TrackEcommerce } from "../../components/Track";
import { API_URL } from "../../lib/api";
import { ClearCart } from "./_components/ClearCart";

export const metadata: Metadata = { title: "Order placed | BongoMaker Store", robots: { index: false } };

type Params = Promise<{ number: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Order = {
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: {
    id: string;
    productId: string | null;
    name: string;
    variantLabel: string | null;
    image: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function fetchOrder(number: string, key: string): Promise<Order | "missing" | null> {
  try {
    const res = await fetch(`${API_URL}/orders/${encodeURIComponent(number)}?key=${encodeURIComponent(key)}`, { cache: "no-store" });
    if (res.status === 404) return "missing";
    return res.ok ? ((await res.json()) as Order) : null;
  } catch {
    return null;
  }
}

async function Confirmation({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { number } = await params;
  const sp = await searchParams;
  const order = await fetchOrder(number, first(sp.key) ?? "");

  if (order === "missing") notFound();
  if (!order) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
        Your order could not be loaded right now. Please try again in a moment.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {first(sp.clear) && <ClearCart />}
      <TrackEcommerce
        event="purchase"
        once={`purchase_${order.orderNumber}`}
        items={order.items.map((i) => ({
          item_id: i.productId ?? i.id,
          item_name: i.name,
          price: i.unitPrice,
          quantity: i.quantity,
          ...(i.variantLabel && { item_variant: i.variantLabel }),
        }))}
        extra={{ transaction_id: order.orderNumber, value: order.total, shipping: order.shippingFee, payment_type: "cash_on_delivery" }}
      />

      <div className="rounded-[var(--radius-card)] border border-accent/30 bg-accent-soft p-6 text-center">
        <h1 className="text-[1.375rem] font-bold text-accent sm:text-[1.75rem]">Thank you, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-1 text-sm text-ink">Your order has been placed.</p>
        <p className="mt-3 text-sm text-muted">Order number</p>
        <p className="text-xl font-extrabold tracking-wide text-brand">{order.orderNumber}</p>
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Items</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3 first:pt-0">
              <LineThumb image={i.image} size="h-14 w-14" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold text-brand">{i.name}</p>
                {i.variantLabel && <p className="text-muted">{i.variantLabel}</p>}
                <p className="text-muted">
                  <Price value={i.unitPrice} /> × {i.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold"><Price value={i.lineTotal} /></p>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd><Price value={order.subtotal} /></dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd><Price value={order.shippingFee} /></dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold text-brand">
            <dt>Total to pay on delivery</dt>
            <dd><Price value={order.total} /></dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-5 text-sm sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Delivering to</h2>
        <p className="mt-3 font-semibold text-brand">{order.customerName}</p>
        <p className="text-ink">{order.address}</p>
        {order.city && <p className="text-ink">{order.city}</p>}
        <p className="mt-1 text-muted">{order.phone}</p>
        {order.email && <p className="text-muted">{order.email}</p>}
        {order.note && <p className="mt-2 text-muted">Note: {order.note}</p>}
      </section>

      <div className="mt-8 text-center">
        <Button href="/shop">Continue shopping</Button>
      </div>
    </div>
  );
}

export default function OrderPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Confirmation params={params} searchParams={searchParams} />
    </Suspense>
  );
}
