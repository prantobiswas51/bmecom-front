import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { LineThumb } from "../../../cart/_components/LineThumb";
import { Price } from "../../../components/Price";
import { fetchMyOrder, orderDate, STATUS, STEPS } from "../../../lib/orders";
import { getCurrentUser } from "../../../lib/session";
import { StatusBadge } from "../../_components/OrderRow";

export const metadata: Metadata = { title: "Order | BongoMaker Store", robots: { index: false } };

type Params = Promise<{ number: string }>;

const panel = "rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6";
const heading = "text-xs font-bold uppercase tracking-[0.08em] text-faint";

async function Order({ params }: { params: Params }) {
  const { number } = await params;
  if (!(await getCurrentUser())) redirect(`/auth/login?next=/account/orders/${encodeURIComponent(number)}`);
  const order = await fetchMyOrder(number);
  if (order === "missing") notFound();
  if (!order) {
    return <p className={`${panel} text-center text-muted`}>This order could not be loaded right now. Please try again in a moment.</p>;
  }

  const step = STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-sm font-semibold text-accent-dark hover:underline">
        ← All orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">Placed on {orderDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {step >= 0 && (
        <ol className={`${panel} grid grid-cols-5 gap-2`} aria-label="Order progress">
          {STEPS.map((s, i) => (
            <li key={s} className="text-center">
              <span className={`mx-auto mb-2 block h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-line"}`} aria-hidden="true" />
              <span className={`text-xs font-semibold sm:text-sm ${i <= step ? "text-brand" : "text-faint"}`}>{STATUS[s].label}</span>
            </li>
          ))}
        </ol>
      )}

      <section className={panel}>
        <h2 className={heading}>Items</h2>
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
              <p className="text-sm font-semibold">
                <Price value={i.lineTotal} />
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>
              <Price value={order.subtotal} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd>
              <Price value={order.shippingFee} />
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-extrabold text-brand">
            <dt>Total (cash on delivery)</dt>
            <dd>
              <Price value={order.total} />
            </dd>
          </div>
        </dl>
      </section>

      <section className={`${panel} text-sm`}>
        <h2 className={heading}>Delivering to</h2>
        <p className="mt-3 font-semibold text-brand">{order.customerName}</p>
        <p className="text-ink">{order.address}</p>
        <p className="mt-1 text-muted">{order.phone}</p>
        {order.note && <p className="mt-2 text-muted">Note: {order.note}</p>}
      </section>
    </div>
  );
}

export default function OrderPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
      <Order params={params} />
    </Suspense>
  );
}
