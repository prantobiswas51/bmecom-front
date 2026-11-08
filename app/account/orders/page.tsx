import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchMyOrders } from "../../lib/orders";
import { getCurrentUser } from "../../lib/session";
import { OrderRow } from "../_components/OrderRow";

export const metadata: Metadata = { title: "My orders | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const panel = "rounded-[var(--radius-card)] border border-line bg-white";

async function Orders({ searchParams }: { searchParams: SearchParams }) {
  if (!(await getCurrentUser())) redirect("/auth/login?next=/account/orders");
  const { page: raw } = await searchParams;
  const page = Math.max(1, Number(Array.isArray(raw) ? raw[0] : raw) || 1);
  const orders = await fetchMyOrders(page);

  return (
    <div>
      <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">My orders</h1>
      <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />

      <div className="mt-6">
        {!orders ? (
          <p className={`${panel} p-8 text-center text-muted`}>Your orders could not be loaded right now.</p>
        ) : orders.items.length === 0 ? (
          <div className={`${panel} p-10 text-center`}>
            <p className="font-semibold text-brand">{page > 1 ? "No orders on this page" : "You have not placed an order yet"}</p>
            <Link href="/shop" className="mt-2 inline-block text-sm font-semibold text-accent-dark hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <>
            <ul className={`${panel} divide-y divide-line`}>
              {orders.items.map((o) => (
                <OrderRow key={o.orderNumber} order={o} />
              ))}
            </ul>
            {orders.totalPages > 1 && (
              <nav aria-label="Order pages" className="mt-4 flex items-center justify-between text-sm font-semibold">
                {page > 1 ? (
                  <Link href={`/account/orders?page=${page - 1}`} className="text-accent-dark hover:underline">
                    ← Newer
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-muted">
                  Page {page} of {orders.totalPages}
                </span>
                {page < orders.totalPages ? (
                  <Link href={`/account/orders?page=${page + 1}`} className="text-accent-dark hover:underline">
                    Older →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}
